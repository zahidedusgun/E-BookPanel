const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");

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

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      req.session.message = { text: "User already exists", class: "danger" };
      return res.redirect("login");
    }
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    emailService.sendMail({
      from: config.email.from,
      to: newUser.email,
      subject: "Welcome to Bookstore",
      text: "You have successfully registered to Bookstore",
      html: "<h1>Welcome to Bookstore</h1><img src='https://i.pinimg.com/originals/83/84/5f/83845fdbef58188b84648df766ee64b4.jpg' alt='Bookstore Image'>",
    });

    req.session.message = {
      text: "User created successfully",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};

exports.GetLogin = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "Login",
      message: message,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
  }
  console.log("token", csrfToken);
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
        message: { text: "Invalid Email or Password", class: "danger" },
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.isAuth = true;
      req.session.username = user.username;

      const url = req.query.returnUrl || "/";
      return res.redirect("/");
    }

    return res.redirect("/");
  } catch (err) {
    console.error(err);
  }
};

exports.GetLogout = async function (req, res) {
  try {
    await req.session.destroy();
    return res.redirect("/account/login");
  } catch (err) {
    console.error(err);
  }
};

exports.GetReset = async function (req, res) {
  console.log("user get çalışıyor");
  try {
    return res.render("auth/reset-password", {
      title: "Reset Password",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.PostReset = async function (req, res) {
  try {
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      req.session.message = { text: "Email not found", class: "danger" };
      return res.redirect("/account/reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    emailService.sendMail({
      from: config.email.from,
      to: user.email,
      subject: "Reset Password",
      html: `
              <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
              <p>
                  <a href="http://localhost:5000/account/new-password/${token}">Parola Sıfırla<a/>
              </p>
          `,
    });

    req.session.message = {
      text: "parolanızı sıfırlamak için eposta adresinizi kontrol ediniz.",
      class: "success",
    };
    res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};

exports.GetNewPassword = async function (req, res) {
  try {
    const user = await User.findOne({
      where: {
        resetToken: req.params.token,
        resetTokenExpiration: { [Op.gt]: Date.now() },
      },
    });
    return res.render("auth/new-password", {
      token: req.params.token,
      userId: user.userId,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.PostNewPassword = async function (req, res) {
  const token = req.params.token;
  const userId = req.body.userId;
  const password = req.body.password;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() },
        userId: userId,
      },
    });
    user.password = await bcrypt.hash(password, 8);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    req.session.message = {
      text: "Password reset successfully",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};
