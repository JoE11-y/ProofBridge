/*
  Warnings:

  - A unique constraint covering the columns `[mmrId,orderHash]` on the table `OrderRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."OrderRecord_orderHash_key";

-- CreateIndex
CREATE UNIQUE INDEX "OrderRecord_mmrId_orderHash_key" ON "public"."OrderRecord"("mmrId", "orderHash");
