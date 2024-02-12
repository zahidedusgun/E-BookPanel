const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.GetRegister = async function (req, res) {
  console.log("user get çalışıyor");
  try {
    return res.render("auth/register", {
      title: "Register",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.PostRegister = async function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 8);

  console.log("user çalışıyor");
  console.log(password);
  try {
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};

exports.GetLogin = async function (req, res) {
  try {
    return res.render("auth/login", {
      title: "Login",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.PostLogin = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    console.log("email", email);
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("auth/login", {
        title: "Login",
        message: "Invalid email or password",
      });
    }

    // Eğer her iki kontrol de başarılıysa, kullanıcıyı yönlendir.
    return res.redirect("/");

  } catch (err) {
    console.error(err);
  }
};

