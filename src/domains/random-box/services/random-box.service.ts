import prisma from "../../../utils/prismaClient";
import { RemainingTimeResult } from "../interfaces/random-box.interface";

// 최근 뽑기 시간 기준으로 남은 시간 계산

export const getRemainingTime = async (
  userId: string
): Promise<RemainingTimeResult> => {
  const lastDraw = await prisma.randomBoxDraw.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastDraw) {
    return { canDraw: true, remainingSeconds: 0 };
  }

  const now = Date.now();
  const lastDrawTime = new Date(lastDraw.createdAt).getTime();
  const diffSec = (now - lastDrawTime) / 1000;
  const remaining = Math.max(0, 3600 - diffSec);

  return {
    canDraw: remaining <= 0,
    remainingSeconds: remaining,
  };
};

// 랜덤박스 뽑기 처리 (쿨타임 검사 + 포인트 추가)

export const drawRandomBox = async (userId: string, pointToAdd: number) => {
  const remaining = await getRemainingTime(userId);
  console.log("remaining", remaining);
  if (!remaining.canDraw) {
    throw {
      code: "COOLDOWN",
      message: `아직 ${Math.ceil(
        remaining.remainingSeconds / 60
      )}분 남았습니다.`,
      nextAvailableAt: new Date(Date.now() + remaining.remainingSeconds * 1000),
    };
  }

  await prisma.randomBoxDraw.create({
    data: {
      userId,
      earnedPoints: pointToAdd,
    },
  });

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
