const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define(
  "Role",
  {
    roleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  { timestamps: false },
  {
    freezeTableName: true // Model tableName will be the same as the model name 
  }
);

module.exports = Role;
