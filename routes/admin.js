const express = require('express');
const router = express.Router();
const path = require('path');

router.use("/book/create", (req, res) => {
    res.render("/admin/book-create");
  });
  
router.use("/books/:bookId", (req, res) => {
    res.render("/admin/book-edit");
  });
  
router.use("/books", (req, res) => {
    res.render("/admin/book-list");
  });
  

module.exports = router;


































router;