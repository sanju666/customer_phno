const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbpath = path.join(__dirname, "todoApplication.db");

app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, async () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
  }
};

initializeDBAndServer();

const validation = (request, response, next) => {
  const { number } = request.body;
  if (String(number).length === 10) {
    next();
  } else {
    response.send("Invalid phone number");
  }
};

//getting the response using the input params

app.get("/login/:number", async (request, response) => {
  const { number } = request.params;
  const query = `select phno from customer where phno=${number};`;
  const queryRun = await db.get(query);
  if (queryRun === undefined) {
    response.send("phone number not present");
  } else {
    response.send("login successfull");
  }
});

//checking the validation using middleware and inserting the data into database.

app.post("/admin/add/", validation, async (request, response) => {
  const { number } = request.body;
  const query = `select phno from customer where phno=${number};`;
  const checkNumber = await db.get(query);
  if (checkNumber === undefined) {
    const insertQuery = `insert into customer(phno)values(${number});`;
    const queryRun = await db.run(insertQuery);
    response.send("phone number added successfully");
  } else {
    response.send("phone number already present ");
  }
});

module.exports = app;
