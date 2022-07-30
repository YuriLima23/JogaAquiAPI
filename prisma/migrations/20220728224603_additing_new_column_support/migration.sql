/*
  Warnings:

  - Added the required column `subject` to the `Support` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Support" ADD COLUMN     "subject" TEXT NOT NULL;
