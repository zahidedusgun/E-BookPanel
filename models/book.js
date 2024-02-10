const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');

const Book = sequelize.define('Book', {
    bookId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

async function sync() {
    await Book.sync({alter: true});
    console.log("Book table created");
}

sync();

module.exports = Book;