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

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      req.session.message = {text: "User already exists", class: "danger"};
      return res.redirect("login");
    }
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    req.session.message = {text: "User created successfully", class: "success"};
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
  console.log("token",csrfToken);
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
        message: {text: "Invalid Email or Password", class: "danger"},
      });
    }

const match = await bcrypt.compare(password, user.password);

    if(match){
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
  try{
    await req.session.destroy();
    return res.render("auth/login", {
      title: "Login",
    });
  }
  catch(err){
    console.error(err);
  }
};
