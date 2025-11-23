/*
  Warnings:

  - You are about to drop the column `code` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "code",
ADD COLUMN     "description" TEXT;
