
import { config } from "dotenv";
config();

export default Object.freeze({
  app: {
    port: Number(process.env.PORT) || 5010
  },
  database: {
    sql: {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    }
  },
  statusCodes: {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    UNAUTHORIZED: 501,
    FORBIDDEN: 403
  }
})