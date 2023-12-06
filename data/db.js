const mysql = require("mysql2");
const config = require("../config");

let connection = mysql.createConnection(config.db);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  connection.query("SELECT * FROM books", function (err, result) {
    result.forEach(function (book) {
      console.log("db page:",book.name);
    });
  });
  console.log("Connected!");
});

module.exports = connection.promise();
