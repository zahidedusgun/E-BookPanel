const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");

app.set("view engine", "ejs");
const Category = require("./models/category");
const Book = require("./models/book");
const User = require("./models/user");
const Role = require("./models/role");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "hello world",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(locals);
app.use(csurf());

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/account", authRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use("/deneme", (req, res) => {
  res.send("viewsindex.html");
});

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

Role.belongsToMany(User, {
  through: "userRoles",
});

User.belongsToMany(Role, {
  through: "userRoles",
});

(async () => {
  // await sequelize.sync({ force: true });
  // await dummyData();
})();

app.listen(5000);
