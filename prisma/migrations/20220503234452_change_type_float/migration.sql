/*
  Warnings:

  - You are about to alter the column `total` on the `Solicitation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - You are about to alter the column `weight` on the `Solicitation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "Solicitation" ALTER COLUMN "total" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(8,2);
