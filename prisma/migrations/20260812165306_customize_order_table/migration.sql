-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_gear_id_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
