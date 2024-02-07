const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");
//Create a book
router.get("/book/create", async (req, res) => {
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

//Creating a book
router.post(
  "/book/create",
  imageUpload.upload.single("image"),
  async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const image = req.file.filename;
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
      res.status(500).json({ error: "burası" });
    }
  }
);

//Selecting a book
router.get("/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const [books] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    const [categories] = await db.execute("SELECT * FROM category");
    const book = books[0];
    if (book) {
      return res.render("admin/book-edit", {
        name: book.name,
        description: book.description,
        book: book,
        image: book.image,
        categories: categories,
      });
    }

    res.redirect("admin/blogs");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Editing the book
router.post(
  "/books/:bookId",
  imageUpload.upload.single("image"),
  async (req, res) => {
    const bookId = req.params.bookId;
    const name = req.body.name;
    const description = req.body.description;
    let image = req.body.image;
    const category = req.body.category;

    if (req.file) {
      image = req.file.filename;
      fs.unlink("./public/images/" + req.body.image, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

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
  }
);

//Delete getting
router.get("/book/delete/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const [books] = await db.execute("SELECT * FROM books WHERE bookId = ?", [
      bookId,
    ]);
    const book = books[0];
    res.render("admin/book-delete", {
      title: "Delete Book",
      book: book,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

//Delete posting
router.post("/book/delete/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    await db.execute("DELETE FROM books WHERE bookId = ?", [bookId]);
    res.redirect("/books?action=deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

//get posts
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

//Categories

//get posts
router.get("/categories", async (req, res) => {
  console.log("Category");
  try {
    const [categories] = await db.execute("SELECT * FROM category");
    console.log("Category", categories);
    res.render("admin/category-list", {
      title: "Category List",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Create a category
router.get(
  "/category/create",
  imageUpload.upload.single("image"),
  async (req, res) => {
    try {
      res.render("admin/category-create", {
        title: "Add Category",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Creating a category
router.post("/category/create", async (req, res) => {
  const name = req.body.name;
  try {
    await db.execute("INSERT INTO category (category_name) VALUES (?)", [name]);
    res.redirect("admin/categories?action=created");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Editing a category
router.get("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const [categories] = await db.execute(
      "SELECT * FROM category WHERE categoryid = ?",
      [categoryId]
    );
    const category = categories[0];
    if (category) {
      return res.render("admin/category-edit", {
        title: "Edit Category",
        category: category,
      });
    }
    res.redirect("admin/categories");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Editing the category
router.post("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const name = req.body.name;
  try {
    await db.execute(
      "UPDATE category SET category_name = ? WHERE categoryid = ?",
      [name, categoryId]
    );
    res.redirect("/admin/categories?action=updated");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Category getting
router.get("/category/delete/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const [categories] = await db.execute(
      "SELECT * FROM category WHERE categoryid = ?",
      [categoryId]
    );
    const category = categories[0];
    res.render("admin/category-delete", {
      title: "Delete Category",
      category: category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Category posting
router.post("/category/delete/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    await db.execute("DELETE FROM category WHERE categoryid = ?", [categoryId]);
    res.redirect("/admin/categories?action=deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

router;
