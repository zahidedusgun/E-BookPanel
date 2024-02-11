const Book = require("../models/book");
const Category = require("../models/category");

exports.BooksByCategory = async function (req, res) {
  const categoryId = req.params.categoryId;
  try {
    const books = await Book.findAll({
      where: {
        categoryid: categoryId,
      },
      raw: true,
    });
    const categories = await Category.findAll({ raw: true });
    if (books.length > 0) {
      return res.render("users/books", {
        title: books[0].name,
        books: books,
        categories: categories,
        selectedCategory: categoryId,
      });
    } else res.render("partials/no-products");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "page not found!" });
    // res.render("partials/no-products")
  }
};

exports.BookDetails = async function (req, res) {
  const bookId = req.params.bookId;
  console.log(bookId);

  try {
    const book = await Book.findByPk(bookId);
    if (book) {
      return res.render("users/book-details", {
        book: book,
      });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.Books = async function (req, res) {
  try {
    const books = await Book.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });

    res.render("users/books", {
      title: "Books",
      books: books,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};

exports.Home = async function (req, res) {
  try {
    const books = await Book.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });
    res.render("users/index", {
      title: "Books",
      books: books,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
