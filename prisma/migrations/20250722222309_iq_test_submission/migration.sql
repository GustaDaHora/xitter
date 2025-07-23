/*
  Warnings:

  - You are about to drop the column `iqTestSubmissions` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "iqTestSubmissions";

-- CreateTable
CREATE TABLE "IQTestSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,

    CONSTRAINT "IQTestSubmission_pkey" PRIMARY KEY ("id")
);
