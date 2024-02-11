const express = require("express");
const router = express.Router();
const slugField = require("../helpers/slugfield");
const imageUpload = require("../helpers/image-upload");

const adminController = require("../controllers/admin");
//Create a book
router.get("/book/create", adminController.GetBookCreate);

router.post("/book/create",imageUpload.upload.single("image"),adminController.PostBookCreate);

//Selecting a book
router.get("/books/:bookId", adminController.GetBookEdit);

//Editing the book
router.post("/books/:bookId",imageUpload.upload.single("image"),adminController.PostBookEdit
);

//Delete getting
router.get("/book/delete/:bookId", adminController.GetBookDelete);

//Delete posting
router.post("/book/delete/:bookId", adminController.PostBookDelete);

//get posts
router.get("/books", adminController.GetAllBooks);

//Categories

//get posts
router.get("/categories", adminController.GetAllCategories);

//Create a category
router.get("/category/create", adminController.GetCategoryCreate);

//Creating a category
router.post("/category/create", adminController.PostCategoryCreate);

// Editing a category
router.get("/categories/:categoryId", adminController.GetCategoryEdit);

//Editing the category
router.post("/categories/:categoryId", adminController.PostCategoryEdit);

//Delete Category getting
router.get("/category/delete/:categoryId", adminController.GetCategoryDelete);

//Delete Category posting
router.post("/category/delete/:categoryId", adminController.PostCategoryDelete);
module.exports = router;

router;
