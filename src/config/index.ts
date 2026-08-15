import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv()

const config = {
    node_env : env.NODE_ENV,
    port : env.PORT,
    database_string : env.DATABASE_URL,
    jwt_secret_key : env.JWT_ACCESS_SECRET!,
    jwt_refresh_key : env.JWT_REFRESH_SECRET!,
    stripe_secret_key: env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret : env.STRIPE_WEBHOOK_SECRET!,
    client_base_url : env.CLIENT_BASE_URL

}

export default config