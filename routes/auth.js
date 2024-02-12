const express = require('express');
const router = express.Router();

const AuthController = require("../controllers/auth");

router.get("/register",AuthController.GetRegister);
router.post("/register",AuthController.PostRegister);

router.get("/login",AuthController.GetLogin);
router.post("/login",AuthController.PostLogin);

module.exports = router;
