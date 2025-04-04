import { PrismaClient, Prisma } from "@prisma/client";
import {
  GetMyPhotocards,
  MyPhotocardsQuery,
  MyPhotocards,
  PhotocardInfo,
  GradeCounts,
  Cursor,
  FilterPhotoCard,
} from "../types/photocard.type";
import {
  PHOTOCARD_GRADES,
  PHOTOCARD_GENRES,
} from "../constants/filter.constant";

const prisma = new PrismaClient();

/**
 * 사용자의 포토카드 목록을 조회하는 함수
 */
const getMyPhotocards: GetMyPhotocards = async (
  userId: string,
  queries: MyPhotocardsQuery
): Promise<MyPhotocards> => {
  const { keyword, grade, genre, limit, cursor } = queries;

  // 사용자 정보 조회
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true },
  });

  if (!currentUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 등급별 카드 개수 조회
  const gradeCounts = await getGradeCounts(userId);

  // 필터링 정보 조회
  const filterInfo = await getFilterInfo(userId);

  // 커서 처리: 전달된 cursor가 없거나 id만 있고 createdAt이 없는 경우를 처리
  let cursorCondition = {};

  if (cursor && cursor.id) {
    if (cursor.createdAt) {
      // createdAt이 이미 있는 경우 - 기존 방식대로 처리
      cursorCondition = {
        OR: [
          { createdAt: { lt: new Date(cursor.createdAt) } },
          {
            createdAt: { equals: new Date(cursor.createdAt) },
            id: { lt: cursor.id },
          },
        ],
      };
    } else {
      // createdAt이 없고 id만 있는 경우 - id 기준으로만 처리
      try {
        const userPhotoCard = await prisma.userPhotoCard.findUnique({
          where: { id: cursor.id },
          select: { createdAt: true },
        });

        if (userPhotoCard) {
          cursorCondition = {
            OR: [
              { createdAt: { lt: userPhotoCard.createdAt } },
              {
                createdAt: { equals: userPhotoCard.createdAt },
                id: { lt: cursor.id },
              },
            ],
          };
        } else {
          // ID에 해당하는 항목을 찾지 못한 경우, 기본값으로 처리
          cursorCondition = { id: { lt: cursor.id } };
        }
      } catch (error) {
        console.error("커서 처리 중 오류 발생:", error);
        // 오류 발생 시 ID만으로 필터링
        cursorCondition = { id: { lt: cursor.id } };
      }
    }
  }

  // 포토카드 목록 조회
  const userPhotoCards = await prisma.userPhotoCard.findMany({
    where: {
      ownerId: userId,
      ...cursorCondition,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  // 다음 페이지 커서 생성
  const hasMore = userPhotoCards.length === limit;
  const nextCursor: Cursor | null =
    hasMore && userPhotoCards.length > 0
      ? {
          id: userPhotoCards[userPhotoCards.length - 1].id,
          createdAt:
            userPhotoCards[userPhotoCards.length - 1].createdAt.toISOString(),
        }
      : null;

  // 결과가 없을 경우 빈 응답 반환
  if (userPhotoCards.length === 0) {
    return {
      userNickname: currentUser.nickname,
      gradeCounts,
      list: null,
      nextCursor: null,
      hasMore: false,
      filterInfo,
    };
  }

  // 포토카드 ID 목록
  const photoCardIds = userPhotoCards.map((card) => card.photoCardId);

  // 필터링 조건 구성
  const photoCardWhereClause: any = {
    id: { in: photoCardIds },
  };

  // 검색 조건 추가
  if (keyword) {
    photoCardWhereClause.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  // 등급 필터 추가
  if (grade && grade !== "ALL") {
    photoCardWhereClause.grade = grade;
  }

  // 장르 필터 추가
  if (genre && genre !== "ALL" && PHOTOCARD_GENRES.includes(genre)) {
    photoCardWhereClause.genre = genre;
  }

  // 포토카드 정보 조회
  const photoCards = await prisma.photoCard.findMany({
    where: photoCardWhereClause,
    include: {
      creator: {
        select: {
          nickname: true,
        },
      },
    },
  });

  // 수량 정보 매핑
  const userPhotoCardMap = new Map(
    userPhotoCards.map((card) => [card.photoCardId, card.quantity])
  );

  // 응답 데이터 매핑
  const mappedPhotocards: PhotocardInfo[] = photoCards.map((photoCard) => ({
    id: photoCard.id,
    name: photoCard.name,
    imageUrl: photoCard.imageUrl,
    grade: photoCard.grade,
    genre: photoCard.genre,
    description: photoCard.description,
    price: photoCard.price,
    amount: userPhotoCardMap.get(photoCard.id) || 0,
    createdAt: photoCard.createdAt.toISOString(),
    creatorNickname: photoCard.creator.nickname,
  }));

  // 필터링 후 결과가 없는 경우
  if (mappedPhotocards.length === 0) {
    return {
      userNickname: currentUser.nickname,
      gradeCounts,
      list: null,
      nextCursor,
      hasMore: false,
      filterInfo,
    };
  }

  // 최종 응답 반환
  return {
    userNickname: currentUser.nickname,
    gradeCounts,
    list: mappedPhotocards,
    nextCursor,
    hasMore,
    filterInfo,
  };
};

/**
 * 사용자가 보유한 등급별 카드 개수를 조회하는 함수
 */
const getGradeCounts = async (userId: string): Promise<GradeCounts> => {
  // 등급별 카드 개수 초기화
  const gradeCounts: GradeCounts = {
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  };

  // SQL 쿼리로 등급별 개수 집계
  const result = await prisma.$queryRaw`
    SELECT p."grade", COUNT(DISTINCT u."photoCardId") as count
    FROM "UserPhotoCard" u
    JOIN "PhotoCard" p ON u."photoCardId" = p."id"
    WHERE u."ownerId" = ${userId}
    GROUP BY p."grade"
  `;

  // 결과 매핑
  (result as { grade: string; count: string }[]).forEach((item) => {
    const grade = item.grade;
    if (grade in gradeCounts) {
      gradeCounts[grade as keyof GradeCounts] = parseInt(item.count, 10);
    }
  });

  return gradeCounts;
};

/**
 * 필터링 정보를 조회하는 함수
 */
const getFilterInfo = async (userId: string): Promise<FilterPhotoCard> => {
  // 등급별 필터 정보 조회
  const gradeFilterQuery = await prisma.$queryRaw`
    SELECT p."grade" as name, COUNT(DISTINCT u."photoCardId") as count
    FROM "UserPhotoCard" u
    JOIN "PhotoCard" p ON u."photoCardId" = p."id"
    WHERE u."ownerId" = ${userId}
    GROUP BY p."grade"
    ORDER BY count DESC
  `;

  // 장르별 필터 정보 조회
  const genreFilterQuery = await prisma.$queryRaw`
    SELECT p."genre" as name, COUNT(DISTINCT u."photoCardId") as count
    FROM "UserPhotoCard" u
    JOIN "PhotoCard" p ON u."photoCardId" = p."id"
    WHERE u."ownerId" = ${userId}
    GROUP BY p."genre"
    ORDER BY count DESC
  `;

  // 결과 매핑
  const gradeFilter = (
    gradeFilterQuery as { name: string; count: string }[]
  ).map((item) => ({
    name: item.name,
    count: parseInt(item.count, 10),
  }));

  const genreFilter = (
    genreFilterQuery as { name: string; count: string }[]
  ).map((item) => ({
    name: item.name,
    count: parseInt(item.count, 10),
  }));

  return {
    grade: gradeFilter.length > 0 ? gradeFilter : null,
    genre: genreFilter.length > 0 ? genreFilter : null,
  };
};

// 서비스 함수 내보내기
const photocardService = {
  getMyPhotocards,
  getGradeCounts,
  getFilterInfo,
};

export default photocardService;
