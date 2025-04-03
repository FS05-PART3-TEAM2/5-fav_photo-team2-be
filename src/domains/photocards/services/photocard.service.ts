import { PrismaClient } from "@prisma/client";
import {
  GetMyPhotocards,
  MyPhotocardsQuery,
  MyPhotocardsResponse,
  PhotocardResponse,
  CursorType,
  GradeCounts,
} from "../types/photocard.type";

const prisma = new PrismaClient();

/**
 * 사용자의 포토카드 목록을 조회하는 함수
 */
const getMyPhotocards: GetMyPhotocards = async (
  userId: string,
  queries: MyPhotocardsQuery
): Promise<MyPhotocardsResponse> => {
  const { keyword, grade, genre, sort, limit, cursor } = queries;

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

  // 커서 기반 페이지네이션으로 포토카드 조회
  const userPhotoCards = await prisma.userPhotoCard.findMany({
    where: {
      ownerId: userId,
      // 복합 커서 조건 적용
      ...(cursor
        ? {
            OR: [
              { createdAt: { lt: new Date(cursor.createdAt) } },
              {
                createdAt: { equals: new Date(cursor.createdAt) },
                id: { lt: cursor.id },
              },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: sort || "desc" }, { id: "desc" }],
    take: limit,
  });

  // 다음 페이지 커서 생성
  const hasMore = userPhotoCards.length === limit;
  const nextCursor: CursorType | null = hasMore
    ? {
        id: userPhotoCards[userPhotoCards.length - 1].id,
        createdAt:
          userPhotoCards[userPhotoCards.length - 1].createdAt.toISOString(),
      }
    : null;

  // 포토카드 ID 목록
  const photoCardIds = userPhotoCards.map((card) => card.photoCardId);

  // 결과가 없을 경우 빈 배열 반환
  if (photoCardIds.length === 0) {
    return {
      success: true,
      userNickname: currentUser.nickname,
      gradeCounts,
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  // 포토카드 정보 조회 및 필터링
  const photoCards = await prisma.photoCard.findMany({
    where: {
      id: { in: photoCardIds },
      // 키워드 검색
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
            ],
          }
        : {}),
      // 등급 필터
      ...(grade && grade !== "ALL" ? { grade } : {}),
      // 장르 필터
      ...(genre && genre !== "전체" ? { genre } : {}),
    },
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

  // 필터링 결과 생성
  const filteredPhotoCards = photoCards.filter((photoCard) =>
    userPhotoCardMap.has(photoCard.id)
  );

  // 응답 데이터 매핑
  const mappedPhotocards: PhotocardResponse[] = filteredPhotoCards.map(
    (photoCard) => ({
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
    })
  );

  // 최종 응답 반환
  return {
    success: true,
    userNickname: currentUser.nickname,
    gradeCounts,
    data: mappedPhotocards,
    nextCursor,
    hasMore,
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
    SELECT p."grade", SUM(u."quantity") as count
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

// 서비스 함수 내보내기
const photocardService = {
  getMyPhotocards,
  getGradeCounts,
};

export default photocardService;
