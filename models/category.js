const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define(
  "Category",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

async function sync() {
  await Category.sync();
  console.log("Category table created");
}

sync();

module.exports = Category;
