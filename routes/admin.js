const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");


const Book = require("../models/book");
const Category = require("../models/category");


//Create a book
router.get("/book/create", async (req, res) => {
  try {

    const categories = await Category.findAll();
    res.render("admin/book-create", {
      title: "Add Book",
      categories: categories,
    });
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Creating a book
// Creating a book
router.post(
  "/book/create",
  imageUpload.upload.single("image"),
  async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const image = req.file.filename;
    const category = req.body.category;
 
    try {
      await Book.create({
        name: name,
        description: description,
        image: image,
        categoryId: category,
      });
      res.redirect("/admin/books?action=created");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Selecting a book
router.get("/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findByPk(bookId);
    const categories = await Category.findAll();

    if (book) {
      return res.render("admin/book-edit", {
        book: book.dataValues,
        categories: categories,
      });
    }
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
      const book = await Book.findByPk(bookId);
      if (book) {
        book.name = name;
        book.description = description;
        book.image = image;
        book.categoryId = category;
        await book.save();
        return res.redirect("/admin/books?action=updated");
      }
      res.redirect("/admin/books");
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
    const books = await Book.findByPk(bookId);

    if (books) {
      return res.render("admin/book-delete", {
        title: "Delete Book",
        book: books.dataValues,
      });
    }
    res.redirect("/admin/books");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

//Delete posting
router.post("/book/delete/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const book = await Book.findByPk(bookId);
    if (book) {
      await book.destroy();
      return res.redirect("/admin/books?action=deleted");
    }
    res.redirect("/books?action=deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET DELETE ERROR" });
  }
});

//get posts
router.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["bookId", "name", "description", "image"],
    });
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
    const categories = await Category.findAll();
    res.render("admin/category-list", {
      title: "Category List",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Get Category Internal Server Error" });
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
      res.status(500).json({ error: "Category Create" });
    }
  }
);

//Creating a category
router.post("/category/create", async (req, res) => {
  const categoryName = req.body.categoryName;
  try {
    await Category.create({
      categoryName: categoryName,
    });
    res.redirect("admin/categories?action=created");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Category Create" });
  }
});

// Editing a category
router.get("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);

    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.categoryName,
        category: category.dataValues,
      });
    }
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Editing the category
router.post("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const categoryName = req.body.categoryName;
  try {
    await Category.update(
      { categoryName: categoryName },
      {
        where: {
          categoryId: categoryId,
        },
      }
    );
    return res.redirect("/admin/categories?action=updated");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Category getting
router.get("/category/delete/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
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
    await Category.destroy({
      where: {
        categoryId: categoryId,
      },
    });
    res.redirect("/admin/categories?action=deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

router;
