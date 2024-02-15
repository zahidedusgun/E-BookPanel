const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

const adminController = require("../controllers/admin");
//Create a book
router.get("/book/create", isAuth, csrf, adminController.GetBookCreate);

router.post(
  "/book/create",
  isAuth,
  imageUpload.upload.single("image"),
  adminController.PostBookCreate
);

//Selecting a book
router.get("/books/:bookId", isAuth, csrf, adminController.GetBookEdit);

//Editing the book
router.post(
  "/books/:bookId",
  isAuth,
  csrf,
  imageUpload.upload.single("image"),
  adminController.PostBookEdit
);

//Delete getting
router.get("/book/delete/:bookId", isAuth, csrf, adminController.GetBookDelete);

//Delete posting
router.post("/book/delete/:bookId", isAuth, adminController.PostBookDelete);

//get posts
router.get("/books", isAuth, adminController.GetAllBooks);

//get posts
router.get("/categories", isAuth, adminController.GetAllCategories);

//Create a category
router.get("/category/create", isAuth, csrf, adminController.GetCategoryCreate);

//Creating a category
router.post("/category/create", isAuth, adminController.PostCategoryCreate);

// Editing a category
router.get(
  "/categories/:categoryId",
  isAuth,
  csrf,
  adminController.GetCategoryEdit
);

//Editing the category
router.post(
  "/categories/:categoryId",
  isAuth,
  adminController.PostCategoryEdit
);

//Delete Category getting
router.get(
  "/category/delete/:categoryId",
  isAuth,
  csrf,
  adminController.GetCategoryDelete
);

//Delete Category posting
router.post(
  "/category/delete/:categoryId",
  isAuth,
  adminController.PostCategoryDelete
);
module.exports = router;
