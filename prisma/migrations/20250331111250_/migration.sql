/*
  Warnings:

  - You are about to drop the column `offeredCardId` on the `ExchangeOffer` table. All the data in the column will be lost.
  - You are about to drop the column `photoCardId` on the `SaleCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marketOfferId]` on the table `ExchangeOffer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marketOfferId]` on the table `SaleCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marketOfferId` to the `ExchangeOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPhotoCardId` to the `ExchangeOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketOfferId` to the `SaleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPhotoCardId` to the `SaleCard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SaleCardStatus" AS ENUM ('ON_SALE', 'SOLD_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExchangeOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MarketOfferType" AS ENUM ('SALE', 'EXCHANGE');

-- AlterTable
ALTER TABLE "ExchangeOffer" DROP COLUMN "offeredCardId",
ADD COLUMN     "marketOfferId" TEXT NOT NULL,
ADD COLUMN     "userPhotoCardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SaleCard" DROP COLUMN "photoCardId",
ADD COLUMN     "exchangeDescription" TEXT,
ADD COLUMN     "exchangeGenre" TEXT,
ADD COLUMN     "exchangeGrade" TEXT,
ADD COLUMN     "marketOfferId" TEXT NOT NULL,
ADD COLUMN     "userPhotoCardId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MarketOffer" (
    "id" TEXT NOT NULL,
    "type" "MarketOfferType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketOffer_ownerId_idx" ON "MarketOffer"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeOffer_marketOfferId_key" ON "ExchangeOffer"("marketOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleCard_marketOfferId_key" ON "SaleCard"("marketOfferId");

-- AddForeignKey
ALTER TABLE "ExchangeOffer" ADD CONSTRAINT "ExchangeOffer_marketOfferId_fkey" FOREIGN KEY ("marketOfferId") REFERENCES "MarketOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleCard" ADD CONSTRAINT "SaleCard_marketOfferId_fkey" FOREIGN KEY ("marketOfferId") REFERENCES "MarketOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
