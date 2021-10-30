-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_user_fkey";

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
