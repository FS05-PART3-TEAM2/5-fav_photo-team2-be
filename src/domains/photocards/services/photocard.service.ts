import { PrismaClient } from "@prisma/client";
import {
  GetMyPhotocards,
  MyPhotocardsQuery,
  MyPhotocardsResponse,
  PhotocardResponse,
  CursorType,
  GradeCounts,
} from "../types/photocard.type";

// Prisma 클라이언트 인스턴스 생성
const prisma = new PrismaClient();

const getMyPhotocards: GetMyPhotocards = async (
  userId: string,
  queries: MyPhotocardsQuery
): Promise<MyPhotocardsResponse> => {
  const { keyword, grade, genre, sortOption, limit, cursor } = queries;

  // 현재 사용자 정보 조회
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true },
  });

  if (!currentUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 사용자의 등급별 카드 개수 조회
  const gradeCounts = await getGradeCounts(userId);

  // 1. 커서 기반 페이지네이션을 적용하여 사용자의 포토카드 조회
  const userPhotoCards = await prisma.userPhotoCard.findMany({
    where: {
      ownerId: userId,
      // 복합 커서 페이지네이션 적용
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
    orderBy: [
      { createdAt: sortOption?.order || ("desc" as any) },
      { id: "desc" },
    ],
    take: limit,
  });

  // 다음 페이지 존재 여부 확인
  const hasMore = userPhotoCards.length === limit;

  // 복합 커서 구성
  const nextCursor: CursorType | null = hasMore
    ? {
        id: userPhotoCards[userPhotoCards.length - 1].id,
        createdAt:
          userPhotoCards[userPhotoCards.length - 1].createdAt.toISOString(),
      }
    : null;

  // 사용자가 소유한 포토카드 ID 목록
  const photoCardIds = userPhotoCards.map((card) => card.photoCardId);

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

  // 2. 포토카드 정보 조회 - 필터링 조건을 쿼리 내에서 처리
  const photoCards = await prisma.photoCard.findMany({
    where: {
      id: { in: photoCardIds },
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(grade && grade !== "ALL" ? { grade } : {}),
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

  // 3. 포토카드 정보와 수량을 매핑
  const userPhotoCardMap = new Map(
    userPhotoCards.map((card) => [card.photoCardId, card.quantity])
  );

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

  return {
    success: true,
    userNickname: currentUser.nickname,
    gradeCounts,
    data: mappedPhotocards,
    nextCursor,
    hasMore,
  };
};

// 사용자가 보유한 등급별 카드 개수 조회 함수
const getGradeCounts = async (userId: string): Promise<GradeCounts> => {
  // 등급별 카드 개수 초기화
  const gradeCounts: GradeCounts = {
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  };

  // Prisma groupBy 쿼리를 사용하여 등급별 개수 조회
  const result = await prisma.$queryRaw`
    SELECT p."grade", SUM(u."quantity") as count
    FROM "UserPhotoCard" u
    JOIN "PhotoCard" p ON u."photoCardId" = p."id"
    WHERE u."ownerId" = ${userId}
    GROUP BY p."grade"
  `;

  // 결과 배열을 순회하며 등급별 개수 설정
  (result as { grade: string; count: string }[]).forEach((item) => {
    const grade = item.grade;
    if (grade in gradeCounts) {
      gradeCounts[grade as keyof GradeCounts] = parseInt(item.count, 10);
    }
  });

  return gradeCounts;
};

// 서비스 함수들을 객체로 묶어서 내보내기
const photocardService = {
  getMyPhotocards,
  getGradeCounts,
};

export default photocardService;
