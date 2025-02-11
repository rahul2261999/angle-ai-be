import { DataTypes, Model, Sequelize } from "sequelize";
import { mysql } from "../mysql";
import { ITenant, TenantCreateAttributes } from "../../apis/tenant/tenant.type";
import { Status } from "../../apis/tenant/tenant.enum";

const sequelize = mysql.getSequelize();

const Tenant = sequelize.define<Model<ITenant, TenantCreateAttributes>>(
  "Tenant",
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
    authkey: {
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
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      key: 'updated_at',
      allowNull: false,
    },
  },
  {
    tableName: 'tenants',
  }
)

export { Tenant }