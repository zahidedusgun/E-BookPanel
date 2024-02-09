const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));//submit edilen verilen düzenli gelir.

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const Book = require("./models/book");
const Category = require("./models/category");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use("/deneme", (req, res) => {
  res.send("viewsindex.html");
});

app.listen(5000);
