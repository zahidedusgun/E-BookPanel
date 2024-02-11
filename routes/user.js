const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.use("/books/category/:slug", userController.BooksByCategory);

router.use("/books/:slug", userController.BookDetails);

router.use("/books", userController.Books);

router.use("/", userController.Home);

module.exports = router;
