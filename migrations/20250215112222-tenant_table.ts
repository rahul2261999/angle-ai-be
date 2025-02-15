'use strict';

import { DataTypes, Model, QueryInterface, Sequelize } from "sequelize";
import { Status } from "../src/apis/tenant/tenant.enum";
import { ITenant } from "../src/apis/tenant/tenant.type";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<Model<ITenant>>(
      "tenants",
      {
        id: {
          type: DataTypes.INTEGER,
          key: 'id',
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(100),
          key: 'name',
          allowNull: false,
        },
        tenantId: {
          type: DataTypes.STRING(26),
          key: 'tenant_id',
          allowNull: false,
        },
        authKey: {
          type: DataTypes.STRING,
          key: 'auth_key',
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(Status)),
          key: 'status',
          defaultValue: 'active',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          key: 'created_by',
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          key: 'updated_by',
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          key: 'created_at',
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          key: 'updated_at',
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        },
      }
    )
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('tenants');
  }
};
