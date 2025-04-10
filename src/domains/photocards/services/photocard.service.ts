import { PrismaClient } from "@prisma/client";
import {
  MyPhotocardsQuery,
  MyPhotocards,
  GradeCounts,
  PhotocardInfo,
  FilterPhotoCard,
  Cursor,
} from "../types/photocard.type";
import { PHOTOCARD_GENRES } from "../constants/filter.constant";

const prisma = new PrismaClient();

/**
 * 사용자 포토카드 목록 조회
 * @param userId 사용자 ID
 * @param queries 쿼리 파라미터
 */
const getMyPhotocards = async (
  userId: string,
  queries: MyPhotocardsQuery
): Promise<MyPhotocards> => {
  const { keyword, grade, genre, limit = 15, cursor } = queries;

  // 사용자 정보 조회
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 등급별 카드 개수 조회
  const gradeCounts = await getGradeCounts(userId);

  // 필터링 정보 조회
  const filterInfo = await getFilterInfo(userId);

  // 커서 설정
  let nextCursor: Cursor | null = null;
  let hasMore = false;

  if (cursor) {
    nextCursor = {
      id: cursor.id,
    };
  }

  // 사용자의 포토카드 목록 조회 (커서 기준 페이지네이션)
  const userPhotoCardsQuery: any = {
    where: {
      ownerId: userId,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  };

  if (nextCursor) {
    userPhotoCardsQuery.cursor = {
      id: nextCursor.id,
    };
    userPhotoCardsQuery.skip = 1;

    // createdAt이 있으면 OR 조건으로 커서 설정
    if (nextCursor.createdAt) {
      userPhotoCardsQuery.where.OR = [
        { createdAt: { lt: new Date(nextCursor.createdAt) } },
        {
          createdAt: { equals: new Date(nextCursor.createdAt) },
          id: { lt: nextCursor.id },
        },
      ];
      delete userPhotoCardsQuery.cursor;
      delete userPhotoCardsQuery.skip;
    }
  }

  const userPhotoCards = await prisma.userPhotoCard.findMany(
    userPhotoCardsQuery
  );

  // 다음 페이지 존재 여부 확인
  if (userPhotoCards.length > limit) {
    hasMore = true;
    userPhotoCards.pop(); // 마지막 항목 제거
    const lastItem = userPhotoCards[userPhotoCards.length - 1];
    nextCursor = {
      id: lastItem.id,
      createdAt: lastItem.createdAt.toISOString(),
    };
  } else {
    nextCursor = null;
  }

  // 포토카드 ID 목록
  const photoCardIds = userPhotoCards.map((card) => card.photoCardId);

  // 필터링 조건 구성
  const photoCardWhereClause = await buildWhereClause({
    photoCardIds,
    keyword,
    grade,
    genre,
  });

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
 * 필터링 조건을 구성하는 함수
 */
const buildWhereClause = async ({
  photoCardIds,
  keyword,
  grade,
  genre,
}: {
  photoCardIds: string[];
  keyword?: string;
  grade?: string;
  genre?: string;
}) => {
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

  // 등급 필터 추가 - 값이 제공되고 "ALL"이 아닌 경우에만 필터링
  if (grade && grade !== "ALL") {
    photoCardWhereClause.grade = grade;
  }

  // 장르 필터 추가 - 값이 제공되고 "ALL"이 아닌 경우에만 필터링
  if (genre && genre !== "ALL" && PHOTOCARD_GENRES.includes(genre)) {
    photoCardWhereClause.genre = genre;
  }

  return photoCardWhereClause;
};

/**
 * 필터 옵션에 따른 포토카드 개수 조회
 */
const getMyPhotocardsCount = async (
  userId: string,
  filters: { grade?: string; genre?: string }
): Promise<number> => {
  // 사용자 존재 여부 확인
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 사용자의 포토카드 목록 조회
  const userPhotoCards = await prisma.userPhotoCard.findMany({
    where: { ownerId: userId },
  });

  if (userPhotoCards.length === 0) {
    return 0;
  }

  // 포토카드 ID 목록
  const photoCardIds = userPhotoCards.map((card) => card.photoCardId);

  // 필터링 조건 구성
  const photoCardWhereClause = await buildWhereClause({
    photoCardIds,
    grade: filters.grade,
    genre: filters.genre,
  });

  // 포토카드 개수 조회
  const count = await prisma.photoCard.count({
    where: photoCardWhereClause,
  });

  return count;
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

// 내 포토카드 상세조회 서비스
const getMyPhotoCardDetailService = async (
  userId: string,
  photoCardId: string
) => {
  const userPhotoCardId = await prisma.photoCard.findFirst({
    where: {
      creatorId: userId,
      id: photoCardId,
    },
  });
  if (!userPhotoCardId) {
    throw new Error("포토카드가 존재하지 않습니다.");
  }

  console.log(userPhotoCardId);
  return userPhotoCardId;
};

// 서비스 함수 내보내기
const photocardService = {
  getMyPhotocards,
  getGradeCounts,
  getFilterInfo,
  getMyPhotocardsCount,
  getMyPhotoCardDetailService,
};

export default photocardService;
