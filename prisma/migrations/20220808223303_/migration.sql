/*
  Warnings:

  - You are about to drop the `Solicitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Support` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Type_Recicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Solicitation" DROP CONSTRAINT "Solicitation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_SolicitationToType_Recicle" DROP CONSTRAINT "_SolicitationToType_Recicle_A_fkey";

-- DropForeignKey
ALTER TABLE "_SolicitationToType_Recicle" DROP CONSTRAINT "_SolicitationToType_Recicle_B_fkey";

-- DropTable
DROP TABLE "Solicitation";

-- DropTable
DROP TABLE "Support";

-- DropTable
DROP TABLE "Type_Recicle";

-- DropTable
DROP TABLE "Wallet";

-- CreateTable
CREATE TABLE "supports" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message_response" TEXT,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "previous_balance" DOUBLE PRECISION,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types_recicles" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_recicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitations" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION DEFAULT 0.00,
    "status" TEXT NOT NULL,
    "weight" DOUBLE PRECISION DEFAULT 0.00,
    "reason_refusal" TEXT,
    "date_of_collect" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL DEFAULT E'',
    "user_id" TEXT NOT NULL,
    "cobrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- AddForeignKey
ALTER TABLE "supports" ADD CONSTRAINT "supports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolicitationToType_Recicle" ADD FOREIGN KEY ("A") REFERENCES "solicitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolicitationToType_Recicle" ADD FOREIGN KEY ("B") REFERENCES "types_recicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
