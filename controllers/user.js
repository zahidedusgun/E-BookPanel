const { where } = require("sequelize");
const Book = require("../models/book");
const Category = require("../models/category");

exports.BooksByCategory = async function (req, res) {
  const slug = req.params.slug;
  try {
    const books = await Book.findAll({
      include: {
        model: Category,
        where: { url: slug },
      },
      raw: true,
    });
    const categories = await Category.findAll({ raw: true });
    if (books.length > 0) {
      return res.render("users/books", {
        title: books[0].name,
        books: books,
        categories: categories,
        selectedCategory: slug,
      });
    } else res.render("partials/no-products");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "page not found!" });
    // res.render("partials/no-products")
  }
};

exports.BookDetails = async function (req, res) {
  const slug = req.params.slug;

  try {
    const book = await Book.findOne({
      where: { url: slug },
      raw: true,
    });
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
  const size = 4;
  const { page = 0 } = req.query;
  const slug = req.params.slug;

  try {
    const { rows, count } = await Book.findAndCountAll({
      raw: true,
      limit: size,
      offset: page * size,
      include: slug
        ? {
            model: Category,
            where: { url: slug }
          }
        : null,
    });
    const categories = await Category.findAll({
      raw: true,
    });

    res.render("users/books", {
      title: "Books",
      books: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      categories: categories,
      selectedCategory: slug,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};

exports.Home = async function (req, res) {
  console.log(req.cookies);
  try {
    const books = await Book.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });
    res.render("users/index", {
      title: "Books",
      books: books,
      categories: categories,
      selectedCategory: null,
      isAuth: req.session.isAuth,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
