var express = require("express");
var formRouter = require("./form/routes");

var appRouter = express.Router();

appRouter.use("/form", formRouter);

module.exports = appRouter;
