import { Sequelize } from "sequelize";
import serverConstant from "../constant/server.constant";
import loggerService from "../utils/logger/logger.service";
import InternalServer from "../utils/error/internal_server.error";

class SqlInstance {
  private static instance: SqlInstance;
  private sequelize: Sequelize;

  private constructor() {
    if(!serverConstant.database.sql.database) {
      loggerService.alert("SqlInstance: Database is not specified");

      throw new InternalServer("SqlInstance: Database is not specified");
    }

    if(!serverConstant.database.sql.username) {
      loggerService.alert("SqlInstance: Username is not specified");

      throw new InternalServer("SqlInstance: Username is not specified");
    }

    this.sequelize = new Sequelize(
      serverConstant.database.sql.database,
      serverConstant.database.sql.username,
      serverConstant.database.sql.password,
      {
        host: serverConstant.database.sql.host,
        port: serverConstant.database.sql.port,
        dialect: serverConstant.database.sql.dialect,
        logging: Boolean(serverConstant.database.sql.logging),
      }
    )
  }

  public static getInstance(): SqlInstance {
    if (!SqlInstance.instance) {
      SqlInstance.instance = new SqlInstance();
    }
    return SqlInstance.instance;
  }
  public async authenticate() {
    try {
      loggerService.info("SqlInstance: executing authentication")
      
      await this.sequelize.authenticate();
     
      loggerService.info("SqlInstance: connection has been established successfully.");
    } catch (error) {
      loggerService.error(null, { error });

      throw new InternalServer("SqlInstance: authentication failed");
    }
  }
  public getSequelize(): Sequelize {
    return this.sequelize;
  }
}

const mysql = SqlInstance.getInstance();

export { mysql }