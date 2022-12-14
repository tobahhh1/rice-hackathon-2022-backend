var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("promise-mysql");
var onFinished = require("on-finished");
var cors = require("cors");

var appRouter = require("./routes/routes");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// setup mysql
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_SCHEMA,
};

app.use(async (req, res, next) => {
  let conn = await mysql.createConnection(config);
  res.locals.conn = conn;

  // end mysql on finish.
  onFinished(res, async (err, res) => {
    await res.locals.conn.end();
  });

  return next();
});

// app router
app.use(appRouter);

module.exports = app;
