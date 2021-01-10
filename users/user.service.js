const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "prenetics_db",
});

connection.connect();

module.exports = {
  authenticate,
  retrieveUserData,
  retrieveGeneticResult,
};

function authenticate({ email, password }) {
  return new Promise(function (resolve, reject) {
    const sqlQuery = `SELECT COUNT(*) AS total_rows FROM prenetics_db.auth where customer_id = (SELECT customer_id FROM prenetics_db.customers WHERE email_address = '${email}') AND password = '${password}';`;
    connection.query(sqlQuery, (err, result, fields) => {
      if (result === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        if (result[0].total_rows === 0) {
          reject(new Error("Username or password is incorrect"));
        } else {
          const token = jwt.sign({ sub: email }, config.secret, {
            expiresIn: "7d",
          });
          resolve({ token });
        }
      }
    });
  });
}

function retrieveUserData({ email }) {
  return new Promise(function (resolve, reject) {
    const sqlQuery = `SELECT first_name, last_name, email_address, date_of_birth FROM prenetics_db.customers WHERE customer_id = (SELECT customer_id FROM prenetics_db.customers WHERE email_address = '${email}')`;
    connection.query(sqlQuery, (err, result, fields) => {
      if (result === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve({
          firstName: result[0].first_name,
          lastName: result[0].last_name,
          email: result[0].email_address,
          dob: result[0].date_of_birth,
        });
      }
    });
  });
}

function retrieveGeneticResult({ email }) {
  return new Promise(function (resolve, reject) {
    const sqlQuery = `SELECT policy_code, result FROM prenetics_db.genetics WHERE customer_id = (SELECT customer_id FROM prenetics_db.customers WHERE email_address = '${email}');`;
    connection.query(sqlQuery, (err, result, fields) => {
      if (result === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve({
          policyCode: result[0].policy_code,
          result: result[0].result,
        });
      }
    });
  });
}
