-- CreateEnum
CREATE TYPE "public"."TokenKind" AS ENUM ('NATIVE', 'ERC20');

-- CreateEnum
CREATE TYPE "public"."AdStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'PAUSED', 'EXHAUSTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."TradeStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'LOCKED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ActionOrigin" AS ENUM ('AD_MANAGER', 'ORDER_PORTAL');

-- CreateEnum
CREATE TYPE "public"."ActionContext" AS ENUM ('CREATEORDER', 'LOCKORDER', 'AUTHORIZE');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthNonce" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthNonce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" BIGINT NOT NULL,
    "adManagerAddress" TEXT NOT NULL,
    "orderPortalAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mmrId" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "kind" "public"."TokenKind" NOT NULL DEFAULT 'ERC20',
    "decimals" INTEGER NOT NULL,
    "chainUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" TEXT NOT NULL,
    "adTokenId" TEXT NOT NULL,
    "orderTokenId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ad" (
    "id" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "creatorDstAddress" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "adTokenId" TEXT NOT NULL,
    "orderTokenId" TEXT NOT NULL,
    "poolAmount" DECIMAL(78,0) NOT NULL,
    "minAmount" DECIMAL(78,0),
    "maxAmount" DECIMAL(78,0),
    "status" "public"."AdStatus" NOT NULL DEFAULT 'INACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdUpdateLog" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "signature" TEXT,
    "reqHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdUpdateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdLock" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "amount" DECIMAL(78,0) NOT NULL,
    "authorized" BOOLEAN NOT NULL DEFAULT false,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trade" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "adCreatorAddress" TEXT NOT NULL,
    "bridgerAddress" TEXT NOT NULL,
    "bridgerDstAddress" TEXT NOT NULL,
    "adCreatorDstAddress" TEXT NOT NULL,
    "orderHash" TEXT NOT NULL,
    "amount" DECIMAL(78,0) NOT NULL,
    "status" "public"."TradeStatus" NOT NULL DEFAULT 'INACTIVE',
    "adCreatorClaimed" BOOLEAN NOT NULL DEFAULT false,
    "bridgerClaimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthorizationLog" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "origin" "public"."ActionOrigin" NOT NULL,
    "tradeId" TEXT NOT NULL,
    "signature" TEXT,
    "reqHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorizationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TradeUpdateLog" (
    "id" TEXT NOT NULL,
    "ctx" "public"."ActionContext" NOT NULL,
    "origin" "public"."ActionOrigin" NOT NULL,
    "tradeId" TEXT NOT NULL,
    "signature" TEXT,
    "reqHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeUpdateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdLog" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "adUpdateLogId" TEXT,

    CONSTRAINT "AdLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TradeLog" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "tradeUpdateLogId" TEXT,

    CONSTRAINT "TradeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MMR" (
    "id" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MMR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderRecord" (
    "id" TEXT NOT NULL,
    "orderHash" TEXT NOT NULL,
    "elementIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mmrId" TEXT NOT NULL,

    CONSTRAINT "OrderRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Secret" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "secretCipherText" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "public"."User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AuthNonce_value_key" ON "public"."AuthNonce"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_key" ON "public"."Chain"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_mmrId_key" ON "public"."Chain"("mmrId");

-- CreateIndex
CREATE INDEX "Chain_name_idx" ON "public"."Chain"("name");

-- CreateIndex
CREATE INDEX "Chain_adManagerAddress_idx" ON "public"."Chain"("adManagerAddress");

-- CreateIndex
CREATE INDEX "Chain_orderPortalAddress_idx" ON "public"."Chain"("orderPortalAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_id_key" ON "public"."Chain"("chainId", "id");

-- CreateIndex
CREATE INDEX "Token_symbol_idx" ON "public"."Token"("symbol");

-- CreateIndex
CREATE INDEX "Token_address_idx" ON "public"."Token"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chainUid_address_key" ON "public"."Token"("chainUid", "address");

-- CreateIndex
CREATE INDEX "Route_adTokenId_idx" ON "public"."Route"("adTokenId");

-- CreateIndex
CREATE INDEX "Route_orderTokenId_idx" ON "public"."Route"("orderTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_orderTokenId_adTokenId_key" ON "public"."Route"("orderTokenId", "adTokenId");

-- CreateIndex
CREATE INDEX "Ad_creatorAddress_status_idx" ON "public"."Ad"("creatorAddress", "status");

-- CreateIndex
CREATE INDEX "Ad_routeId_status_idx" ON "public"."Ad"("routeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AdUpdateLog_adId_key" ON "public"."AdUpdateLog"("adId");

-- CreateIndex
CREATE UNIQUE INDEX "AdUpdateLog_reqHash_key" ON "public"."AdUpdateLog"("reqHash");

-- CreateIndex
CREATE UNIQUE INDEX "AdLock_tradeId_key" ON "public"."AdLock"("tradeId");

-- CreateIndex
CREATE INDEX "Trade_adId_idx" ON "public"."Trade"("adId");

-- CreateIndex
CREATE INDEX "Trade_routeId_idx" ON "public"."Trade"("routeId");

-- CreateIndex
CREATE INDEX "Trade_adCreatorAddress_idx" ON "public"."Trade"("adCreatorAddress");

-- CreateIndex
CREATE INDEX "Trade_bridgerAddress_idx" ON "public"."Trade"("bridgerAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationLog_reqHash_key" ON "public"."AuthorizationLog"("reqHash");

-- CreateIndex
CREATE UNIQUE INDEX "TradeUpdateLog_tradeId_key" ON "public"."TradeUpdateLog"("tradeId");

-- CreateIndex
CREATE INDEX "TradeUpdateLog_reqHash_idx" ON "public"."TradeUpdateLog"("reqHash");

-- CreateIndex
CREATE UNIQUE INDEX "MMR_chainId_key" ON "public"."MMR"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "MMR_chainId_id_key" ON "public"."MMR"("chainId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderRecord_mmrId_orderHash_key" ON "public"."OrderRecord"("mmrId", "orderHash");

-- CreateIndex
CREATE UNIQUE INDEX "OrderRecord_mmrId_elementIndex_key" ON "public"."OrderRecord"("mmrId", "elementIndex");

-- CreateIndex
CREATE UNIQUE INDEX "OrderRecord_orderHash_mmrId_key" ON "public"."OrderRecord"("orderHash", "mmrId");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_tradeId_key" ON "public"."Secret"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_secretHash_key" ON "public"."Secret"("secretHash");

-- AddForeignKey
ALTER TABLE "public"."Chain" ADD CONSTRAINT "Chain_mmrId_fkey" FOREIGN KEY ("mmrId") REFERENCES "public"."MMR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_chainUid_fkey" FOREIGN KEY ("chainUid") REFERENCES "public"."Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_adTokenId_fkey" FOREIGN KEY ("adTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_orderTokenId_fkey" FOREIGN KEY ("orderTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_adTokenId_fkey" FOREIGN KEY ("adTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_orderTokenId_fkey" FOREIGN KEY ("orderTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdUpdateLog" ADD CONSTRAINT "AdUpdateLog_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLock" ADD CONSTRAINT "AdLock_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLock" ADD CONSTRAINT "AdLock_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthorizationLog" ADD CONSTRAINT "AuthorizationLog_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeUpdateLog" ADD CONSTRAINT "TradeUpdateLog_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLog" ADD CONSTRAINT "AdLog_adUpdateLogId_fkey" FOREIGN KEY ("adUpdateLogId") REFERENCES "public"."AdUpdateLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeLog" ADD CONSTRAINT "TradeLog_tradeUpdateLogId_fkey" FOREIGN KEY ("tradeUpdateLogId") REFERENCES "public"."TradeUpdateLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderRecord" ADD CONSTRAINT "OrderRecord_mmrId_fkey" FOREIGN KEY ("mmrId") REFERENCES "public"."MMR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Secret" ADD CONSTRAINT "Secret_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
