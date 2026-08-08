import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv()

const config = {
    node_env : env.NODE_ENV,
    port : env.PORT,
    database_string : env.DATABASE_URL,

}

export default config