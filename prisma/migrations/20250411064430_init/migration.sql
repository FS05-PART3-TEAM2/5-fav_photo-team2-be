-- CreateEnum
CREATE TYPE "SaleCardStatus" AS ENUM ('ON_SALE', 'SOLD_OUT', 'CANCELED');

-- CreateEnum
CREATE TYPE "ExchangeOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'FAILED');

-- CreateEnum
CREATE TYPE "MarketOfferType" AS ENUM ('SALE', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "PhotoCardGrade" AS ENUM ('COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY');

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeOffer" (
    "id" TEXT NOT NULL,
    "offererId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "saleCardId" TEXT NOT NULL,
    "userPhotoCardId" TEXT NOT NULL,

    CONSTRAINT "ExchangeOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketOffer" (
    "id" TEXT NOT NULL,
    "type" "MarketOfferType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "saleCardId" TEXT,
    "exchangeOfferId" TEXT,

    CONSTRAINT "MarketOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "PhotoCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointHistory" (
    "id" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RandomBoxDraw" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "earnedPoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RandomBoxDraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleCard" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "exchangeDescription" TEXT NOT NULL,
    "exchangeGrade" TEXT NOT NULL,
    "exchangeGenre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerId" TEXT NOT NULL,
    "photoCardId" TEXT NOT NULL,
    "userPhotoCardId" TEXT NOT NULL,

    CONSTRAINT "SaleCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "saleCardId" TEXT NOT NULL,
    "newOwnerId" TEXT NOT NULL,
    "oldOwnerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPhotoCard" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoCardId" TEXT NOT NULL,

    CONSTRAINT "UserPhotoCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketOffer_saleCardId_key" ON "MarketOffer"("saleCardId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketOffer_exchangeOfferId_key" ON "MarketOffer"("exchangeOfferId");

-- CreateIndex
CREATE INDEX "MarketOffer_ownerId_idx" ON "MarketOffer"("ownerId");

-- CreateIndex
CREATE INDEX "PhotoCard_grade_genre_idx" ON "PhotoCard"("grade", "genre");

-- CreateIndex
CREATE UNIQUE INDEX "Point_userId_key" ON "Point"("userId");

-- CreateIndex
CREATE INDEX "SaleCard_sellerId_idx" ON "SaleCard"("sellerId");

-- CreateIndex
CREATE INDEX "SaleCard_status_idx" ON "SaleCard"("status");

-- CreateIndex
CREATE INDEX "SaleCard_photoCardId_idx" ON "SaleCard"("photoCardId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleCard_createdAt_id_key" ON "SaleCard"("createdAt", "id");

-- CreateIndex
CREATE INDEX "TransactionLog_saleCardId_idx" ON "TransactionLog"("saleCardId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE INDEX "UserPhotoCard_ownerId_idx" ON "UserPhotoCard"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPhotoCard_ownerId_photoCardId_key" ON "UserPhotoCard"("ownerId", "photoCardId");
