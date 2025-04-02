import prisma from "../../../utils/prismaClient";
import { RemainingTimeResult } from "../interfaces/random-box.interface";

// 최근 뽑기 시간 조회
export const getRemainingTime = async (
  userId: string
): Promise<RemainingTimeResult> => {
  // 최근 뽑기 기록 조회
  const lastDraw = await prisma.randomBoxDraw.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // 쿨타임 없으면 바로 뽑기 가능
  if (!lastDraw) {
    return { canDraw: true, remainingSeconds: 0 };
  }

  /*
   * 쿨타임 1시간(3600초) 설정
   * 쿨타임이 지나면 true, 아니면 false
   * remainingSeconds는 남은 쿨타임(초)으로, 0보다 작으면 0으로 설정
   */
  const now = Date.now();
  const lastDrawTime = new Date(lastDraw.createdAt).getTime();
  const diffSec = (now - lastDrawTime) / 1000;
  const remaining = Math.max(0, 3600 - diffSec);
  const canDraw = remaining <= 0;

  // 쿨타임이 지나면 true, 아니면 false
  return {
    canDraw,
    remainingSeconds: remaining,
    message: canDraw
      ? "지금 바로 뽑을 수 있습니당!"
      : `아직 ${Math.ceil(remaining / 60)}분 남았습니다.`,
  };
};

// 랜덤박스 뽑기 처리 (쿨타임 검사 + 포인트 추가)
export const drawRandomBox = async (userId: string, pointToAdd: number) => {
  // 쿨타임 확인
  const remaining = await getRemainingTime(userId);
  console.log("remaining", remaining);

  // 쿨타임 남았으면 에러 처리
  if (!remaining.canDraw) {
    throw {
      code: "COOLDOWN_ACTIVE",
      message: `아직 ${Math.ceil(
        remaining.remainingSeconds / 60
      )}분 남았습니다.`,
      nextAvailableAt: new Date(Date.now() + remaining.remainingSeconds * 1000),
    };
  }

  // 랜덤박스 뽑기 기록 생성
  await prisma.randomBoxDraw.create({
    data: {
      userId,
      earnedPoints: pointToAdd,
    },
  });

  // point 테이블에 포인트가 없으면 생성하고, 있으면 업데이트
  const existingPoint = await prisma.point.findUnique({
    where: { userId },
  });

  if (existingPoint) {
    await prisma.point.update({
      where: { userId },
      data: {
        points: {
          increment: pointToAdd,
        },
      },
    });
  } else {
    await prisma.point.create({
      data: {
        userId,
        points: pointToAdd,
      },
    });
  }

  return {
    message: "뽑기 성공",
    addedPoint: pointToAdd,
  };
};
