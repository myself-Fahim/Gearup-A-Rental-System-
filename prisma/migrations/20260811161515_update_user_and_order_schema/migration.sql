-- CreateEnum
CREATE TYPE "User_status" AS ENUM ('suspend', 'activate');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Order_Status" ADD VALUE 'PICKED_UP';
ALTER TYPE "Order_Status" ADD VALUE 'RETURNED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "User_status" NOT NULL DEFAULT 'activate';
