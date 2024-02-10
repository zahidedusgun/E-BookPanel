const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define(
  "Category",
  {
    categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

async function sync() {
  await Category.sync({alter: true});
  console.log("Category table created");
}

sync();

module.exports = Category;
