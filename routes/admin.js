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
     res.redirect("/admin/books?action=created");
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
      action: req.query.action,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const [books, ] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    const [categories, ] = await db.execute("SELECT * FROM category");
    const book = books[0];
    console.log(book);
    if (book) {
      return res.render("admin/book-edit",
        {
          name: book.name,
          description: book.description,
          book: book,
          image: book.image,
          categories: categories,
          console: console.log("burası",categories),
        });
    }
    
    res.redirect("admin/blogs");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Editing the book
router.post("/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const category = req.body.category;

  try {
    await db.execute(
      "UPDATE books SET name = ?, description = ?, image = ?, categoryid = ? WHERE bookId = ?",
      [name, description, image, category, bookId]
    );
    res.redirect("/admin/books?action=updated");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/book/delete/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const [books, ] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    const book = books[0];
    res.render("admin/book-delete", {
      title: "Delete Book",
      book: book,
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

router.post("/book/delete/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    await db.execute("DELETE FROM books WHERE bookId = ?", [bookId]);
    res.redirect("/books?action=deleted");
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

module.exports = router;

router;
