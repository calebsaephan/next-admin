/*
  Warnings:

  - You are about to drop the column `defaultShippingId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userAddressId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isDefault` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultShippingId",
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "UserAddress" ADD COLUMN     "isDefault" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userAddressId_key" ON "User"("userAddressId");
