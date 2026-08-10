-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_gear_id_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
