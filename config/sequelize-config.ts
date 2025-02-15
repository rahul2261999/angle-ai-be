import { Dialect } from "sequelize";
import serverConstant from "../src/constant/server.constant";

const config = {
  username: serverConstant.database.sql.username,
  password: serverConstant.database.sql.password,
  database: serverConstant.database.sql.database,
  host: serverConstant.database.sql.host,
  port: serverConstant.database.sql.port,
  dialect: serverConstant.database.sql.dialect,
}

module.exports = config;