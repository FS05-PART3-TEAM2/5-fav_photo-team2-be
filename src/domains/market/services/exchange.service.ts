import { PrismaClient } from "@prisma/client";
import { IExchangeOffer } from "../interfaces/exchange.interface";

const prisma = new PrismaClient();

export const declineOffer = async (id: string): Promise<IExchangeOffer> => {
  return prisma.exchangeOffer.update({
    where: { id },
    data: { status: "declined" },
  });
};
