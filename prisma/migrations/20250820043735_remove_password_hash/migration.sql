/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "passwordHash";
