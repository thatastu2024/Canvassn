/*
  Warnings:

  - You are about to drop the column `deliver` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resend_mail_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MailBody" ADD COLUMN     "deliver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resend_mail_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deliver",
DROP COLUMN "resend_mail_id";
