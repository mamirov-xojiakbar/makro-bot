const mysql = require("mysql2");
require('dotenv').config(); 
const { HOST, USER1, PASSWORD, DB } = process.env;

const connection = mysql.createConnection({
  host: HOST,
  user: USER1,
  password: PASSWORD,
  database: DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = connection;
