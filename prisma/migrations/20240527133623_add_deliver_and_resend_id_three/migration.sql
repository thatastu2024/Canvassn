/*
  Warnings:

  - You are about to drop the column `deliver` on the `MailBody` table. All the data in the column will be lost.
  - You are about to drop the column `resend_mail_id` on the `MailBody` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mail" ADD COLUMN     "deliver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resend_mail_id" INTEGER;

-- AlterTable
ALTER TABLE "MailBody" DROP COLUMN "deliver",
DROP COLUMN "resend_mail_id";
