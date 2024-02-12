const Book = require("../models/book");
const Category = require("../models/category");
const fs = require("fs");
const slugField = require("../helpers/slugfield");

exports.GetBookDelete = async (req, res) => {
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
};

exports.PostBookDelete = async (req, res) => {
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
};

exports.GetCategoryDelete = async (req, res) => {
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
};

exports.PostCategoryDelete = async (req, res) => {
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
};

exports.GetBookCreate = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render("admin/book-create", {
      title: "Add Book",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.PostBookCreate = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.file.filename;
  const category = req.body.category;

  try {
    await Book.create({
      name: name,
      url: slugField(name),
      description: description,
      image: image,
      categoryId: category,
    });
    res.redirect("/admin/books?action=created");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.GetCategoryCreate = async (req, res) => {
  try {
    res.render("admin/category-create", {
      title: "Add Category",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Category Create" });
  }
};

exports.PostCategoryCreate = async (req, res) => {
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
};

exports.GetBookEdit = async (req, res) => {
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
};

exports.PostBookEdit = async (req, res) => {
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
};

exports.GetCategoryEdit = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
    const books = await category.getBooks();
    const countBook = await category.countBooks();

    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.categoryName,
        category: category.dataValues,
        books: books,
        countBook: countBook,
      });
    }
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.PostCategoryEdit = async (req, res) => {
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
};

exports.GetAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["bookId", "name", "description", "image"],
      include: [
        {
          model: Category,
          attributes: ["categoryName"],
        },
      ],
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
};

exports.GetAllCategories = async (req, res) => {
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
};
