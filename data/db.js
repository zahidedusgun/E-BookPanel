const mysql = require("mysql2");
const config = require("../config");

const Sequelize = require("sequelize");
const { connect } = require("../routes/user");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  dialect: "mysql",
  host: config.db.host,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;