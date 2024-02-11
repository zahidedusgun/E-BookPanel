const Category = require("../models/category");
const Book = require("../models/book");
const slugifyField = require('../helpers/slugfield');

async function populate() {
  const count = await Category.count();
  if (count == 0) {
    await Category.bulkCreate([
      { categoryName: "Fiction", url: slugifyField("Fiction"),},
      { categoryName: "Non-Fiction", url: slugifyField("Non-Fiction"),},
      { categoryName: "Science Fiction", url: slugifyField("Science Fiction"),},
      { categoryName: "Fantasy", url: slugifyField("Fantasy"),},
      { categoryName: "Mystery", url: slugifyField("Mystery"),},
    ]);

    await Book.bulkCreate([
      {
        name: "The Alchemist",
        url: slugifyField("The Alchemist"),
        description: "A book about following your dreams",
        image: "alchemist.jpg",
        categoryId: 1,
      },
    ]);

    await Book.bulkCreate([
      {
        name: "The Da Vinci Code",
        url: slugifyField("The Da Vinci Code"),
        description: "A book about a code",
        image: "davinci.jpg",
        categoryId: 2,
        },
    ]);

    await Book.bulkCreate([
      {
        name: "The Hobbit",
        url: slugifyField("The Hobbit"),
        description: "A book about a hobbit",
        image: "hobbit.jpg",
        categoryId: 4,
      },
    ]);

    await Book.bulkCreate([
      {
        name: "The Hunger Games",
        url: slugifyField("The Hunger Games"),
        description: "A book about games",
        image: "hungergames.jpg",
        categoryId: 4,
      },
    ]);
  }
}

module.exports = populate;