const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //submit edilen verilen düzenli gelir.
app.use(cookieParser());
app.use(
  session({
    secret: "SecretSessionKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },

}));

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/account", authRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes);


app.use("/deneme", (req, res) => {
  res.send("viewsindex.html");
});

const sequelize = require("./data/db");
const Category = require("./models/category");
const Book = require("./models/book");
const User = require("./models/user");
const dummyData = require("./data/dummy-data");

Category.hasMany(Book, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
Book.belongsTo(Category, {
  foreignKey: "categoryId",
});

Book.belongsTo(User, {
  foreignKey: {
    allowNull: true,
  },
});
User.hasMany(Book);

(async () => {
  await sequelize.sync({ force: true });
  await dummyData();
})();

app.listen(5000);
