const express = require("express");
const router = express.Router();
const path = require("path");

const db = require("../data/db");

router.get("/book/create", async (req, res) => {
  console.log("req.body");
  try {
    const [categories] = await db.execute("SELECT * FROM category");
    res.render("admin/book-create", {
      title: "Add Book",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/book/create", async (req, res) => {
  console.log("post içi");
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const category = req.body.category;
  const home = req.body.home == "on" ? 1 : 0;
  const accept = req.body.accept == "on" ? 1 : 0;

  try {
    await db.execute(
      "INSERT INTO books (name, description, image, categoryid, home, accept) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, image, category, home, accept]
    );
    // res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/book/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const [books] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    const [categories] = await db.execute("SELECT * FROM category");
    const book = books[0];
    console.log(book);
    if (book) {
      return (
        res.render("admin/book-edit"),
        {
          name: book.name,
          description: book.description,
          book: book,
          categories: categories,
          console: console.log(categories),
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/books", async (req, res) => {
  try {
    const [books] = await db.execute("SELECT * FROM books");
    res.render("admin/book-list", {
      title: "Book List",
      books: books,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

router;
