const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth");
const csrf = require("../middlewares/csrf");

router.get("/register", csrf, AuthController.GetRegister);
router.post("/register", AuthController.PostRegister);

router.get("/login", csrf, AuthController.GetLogin);
router.post("/login", AuthController.PostLogin);

router.get("/logout", csrf, AuthController.GetLogout);

module.exports = router;
