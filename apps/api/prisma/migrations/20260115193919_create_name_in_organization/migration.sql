/*
  Warnings:

  - Added the required column `name` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "name" TEXT NOT NULL;
