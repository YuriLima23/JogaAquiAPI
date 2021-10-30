/*
  Warnings:

  - The `previous_balance` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `balance` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL,
DROP COLUMN "previous_balance",
ADD COLUMN     "previous_balance" DOUBLE PRECISION;
