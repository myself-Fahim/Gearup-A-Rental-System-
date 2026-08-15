-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_category_id_fkey";

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
