-- CreateEnum
CREATE TYPE "public"."TokenKind" AS ENUM ('NATIVE', 'ERC20');

-- CreateEnum
CREATE TYPE "public"."AdStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXHAUSTED', 'CLOSED');

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
    "fromTokenId" TEXT NOT NULL,
    "toTokenId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ad" (
    "id" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "fromTokenId" TEXT NOT NULL,
    "toTokenId" TEXT NOT NULL,
    "poolAmount" BIGINT NOT NULL,
    "minAmount" BIGINT,
    "maxAmount" BIGINT,
    "status" "public"."AdStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdLock" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
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
    "amount" DECIMAL(78,0) NOT NULL,
    "participantSignatures" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Route_fromTokenId_idx" ON "public"."Route"("fromTokenId");

-- CreateIndex
CREATE INDEX "Route_toTokenId_idx" ON "public"."Route"("toTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_fromTokenId_toTokenId_key" ON "public"."Route"("fromTokenId", "toTokenId");

-- CreateIndex
CREATE INDEX "Ad_creatorAddress_status_idx" ON "public"."Ad"("creatorAddress", "status");

-- CreateIndex
CREATE INDEX "Ad_routeId_status_idx" ON "public"."Ad"("routeId", "status");

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

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_chainUid_fkey" FOREIGN KEY ("chainUid") REFERENCES "public"."Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_fromTokenId_fkey" FOREIGN KEY ("fromTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_toTokenId_fkey" FOREIGN KEY ("toTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_fromTokenId_fkey" FOREIGN KEY ("fromTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_toTokenId_fkey" FOREIGN KEY ("toTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLock" ADD CONSTRAINT "AdLock_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLock" ADD CONSTRAINT "AdLock_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
