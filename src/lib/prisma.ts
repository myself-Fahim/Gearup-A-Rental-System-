import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma/client";
import config from "../config";


const adapter = new PrismaPg({ connectionString : config.database_string});
const prisma = new PrismaClient({ adapter });
export default prisma