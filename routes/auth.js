const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth");
const csrf = require("../middlewares/csrf");

router.get("/register", csrf, AuthController.GetRegister);
router.post("/register", AuthController.PostRegister);

router.get("/login", csrf, AuthController.GetLogin);
router.post("/login", AuthController.PostLogin);

router.get("/logout", csrf, AuthController.GetLogout);

router.get("/reset-password", csrf, AuthController.GetReset);
router.post("/reset-password", AuthController.PostReset);


router.get("/new-password/:token", csrf, AuthController.GetNewPassword);
router.post("/new-password", AuthController.PostNewPassword);
module.exports = router;
