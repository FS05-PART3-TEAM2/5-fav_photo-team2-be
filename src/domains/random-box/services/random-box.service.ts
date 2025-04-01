import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const COOLDOWN_HOURS = 1;

export const canOpenRandomBox = async (userId: string) => {
  const lastOpen = await prisma.randomBoxDraw.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastOpen) return { canOpen: true };

  const nextAvailableAt = dayjs(lastOpen.createdAt).add(COOLDOWN_HOURS, "hour");
  const now = dayjs();

  return {
    canOpen: now.isAfter(nextAvailableAt),
    nextAvailableAt: nextAvailableAt.toDate(),
  };
};

export const openRandomBox = async (userId: string) => {
  const status = await canOpenRandomBox(userId);
  if (!status.canOpen)
    throw { status: 429, nextAvailableAt: status.nextAvailableAt };

  const earnedPoints = Math.floor(Math.random() * 101) + 50;

  const box = await prisma.randomBoxDraw.create({
    data: {
      userId,
      earnedPoints,
    },
  });

  return {
    earnedPoints: box.earnedPoints,
    nextAvailableAt: dayjs(box.createdAt).add(COOLDOWN_HOURS, "hour").toDate(),
  };
};
