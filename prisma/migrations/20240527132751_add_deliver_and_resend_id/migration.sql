-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deliver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resend_mail_id" INTEGER;
