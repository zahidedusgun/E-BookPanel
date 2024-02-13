const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const isAuth = require("../middlewares/auth");

const adminController = require("../controllers/admin");
//Create a book
router.get("/book/create", isAuth, adminController.GetBookCreate);

router.post(
  "/book/create",
  isAuth,
  imageUpload.upload.single("image"),
  adminController.PostBookCreate
);

//Selecting a book
router.get("/books/:bookId", isAuth, adminController.GetBookEdit);

//Editing the book
router.post(
  "/books/:bookId",
  isAuth,
  imageUpload.upload.single("image"),
  adminController.PostBookEdit
);

//Delete getting
router.get("/book/delete/:bookId", isAuth, adminController.GetBookDelete);

//Delete posting
router.post("/book/delete/:bookId", isAuth, adminController.PostBookDelete);

//get posts
router.get("/books", isAuth, adminController.GetAllBooks);

//Categories

//get posts
router.get("/categories", isAuth, adminController.GetAllCategories);

//Create a category
router.get("/category/create", isAuth, adminController.GetCategoryCreate);

//Creating a category
router.post("/category/create", isAuth, adminController.PostCategoryCreate);

// Editing a category
router.get("/categories/:categoryId", isAuth, adminController.GetCategoryEdit);

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
  adminController.GetCategoryDelete
);

//Delete Category posting
router.post(
  "/category/delete/:categoryId",
  isAuth,
  adminController.PostCategoryDelete
);
module.exports = router;
