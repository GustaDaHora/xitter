/*
  Warnings:

  - You are about to drop the column `duration` on the `IQTestSubmission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'COMMENT');

-- AlterTable
ALTER TABLE "IQTestSubmission" DROP COLUMN "duration";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
