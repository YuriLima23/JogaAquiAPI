-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_user_fkey";

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
