import { PrismaClient } from "@prisma/client";
import { ExchangeOffer } from "../interfaces/exchange.interface";

const prisma = new PrismaClient();

export const declineOffer = async (id: string): Promise<ExchangeOffer> => {
  return prisma.exchangeOffer.update({
    where: { id },
    data: { status: "declined" },
  });
};
