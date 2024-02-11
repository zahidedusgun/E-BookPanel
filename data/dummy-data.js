const Category = require("../models/category");
const Book = require("../models/book");

async function populate() {
  const count = await Category.count();
  if (count == 0) {
    await Category.bulkCreate([
      { categoryName: "Fiction" },
      { categoryName: "Non-Fiction" },
      { categoryName: "Science Fiction" },
      { categoryName: "Fantasy" },
      { categoryName: "Mystery" },
    ]);

    await Book.bulkCreate([
      {
        name: "The Alchemist",
        description: "A book about following your dreams",
        image: "alchemist.jpg",
        categoryId: 1,
      },
    ]);

    await Book.bulkCreate([
      {
        name: "The Da Vinci Code",
        description: "A book about a code",
        image: "davinci.jpg",
        categoryId: 2,
        },
    ]);

    await Book.bulkCreate([
      {
        name: "The Hobbit",
        description: "A book about a hobbit",
        image: "hobbit.jpg",
        categoryId: 4,
      },
    ]);

    await Book.bulkCreate([
      {
        name: "The Hunger Games",
        description: "A book about games",
        image: "hungergames.jpg",
        categoryId: 4,
      },
    ]);
  }
}

module.exports = populate;