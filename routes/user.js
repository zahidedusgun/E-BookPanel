const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.use("/books/category/:categoryid", async function (req, res) {
  const categoryId = req.params.categoryid;
  console.log(categoryId)

  try {
    const [books, ] = await db.execute("SELECT * FROM books WHERE categoryId = ?", [
      categoryId,
    ]);
    const [categories, ] = await db.execute("SELECT * FROM category");
    console.log(books[0].name)
      return res.render("users/books", {
        title: books[0].name,
        books: books,
        categories: categories,
        selectedCategory: categoryId,
      });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "page not found!" });
    // res.render("partials/no-products")
  }
});

router.use("/books/:bookid", async function (req, res) {
  const bookId = req.params.bookid;
  console.log(bookId)

  try {
    const [books] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    console.log(books[0].name)
    if (books[0]) {
      return res.render("users/book-details", {
        name: books[0].name,
        bookid: bookId,
        description: books[0].description,
        books: books[0],
        selectedCategory: null,
      });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.use("/books", async function (req, res) {
  try {
    const [books] = await db.execute("SELECT * FROM books");
    const [categories] = await db.execute("SELECT * FROM category");

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
});

router.use("/", async function (req, res) {
  try {
    const [books] = await db.execute("SELECT * FROM books");
    const [categories] = await db.execute("SELECT * FROM category");

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
});

module.exports = router;
