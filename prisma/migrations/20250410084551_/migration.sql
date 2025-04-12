/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExchangeOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhotoCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RandomBoxDraw` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPhotoCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Auth";

-- DropTable
DROP TABLE "ExchangeOffer";

-- DropTable
DROP TABLE "MarketOffer";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "PhotoCard";

-- DropTable
DROP TABLE "Point";

-- DropTable
DROP TABLE "PointHistory";

-- DropTable
DROP TABLE "RandomBoxDraw";

-- DropTable
DROP TABLE "SaleCard";

-- DropTable
DROP TABLE "TransactionLog";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserPhotoCard";

-- DropEnum
DROP TYPE "ExchangeOfferStatus";

-- DropEnum
DROP TYPE "MarketOfferType";

-- DropEnum
DROP TYPE "PhotoCardGrade";

-- DropEnum
DROP TYPE "SaleCardStatus";
