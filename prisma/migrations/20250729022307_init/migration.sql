/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ShippingAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShippingAddressToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addressLine1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultShippingId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "_ShippingAddressToUser" DROP CONSTRAINT "_ShippingAddressToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShippingAddressToUser" DROP CONSTRAINT "_ShippingAddressToUser_B_fkey";

-- DropIndex
DROP INDEX "Order_paymentId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentId",
DROP COLUMN "shippingAddressId",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shippingAddressId",
ADD COLUMN     "defaultShippingId" TEXT NOT NULL,
ADD COLUMN     "userAddressId" TEXT;

-- DropTable
DROP TABLE "ShippingAddress";

-- DropTable
DROP TABLE "_ShippingAddressToUser";

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userAddressId_fkey" FOREIGN KEY ("userAddressId") REFERENCES "UserAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
