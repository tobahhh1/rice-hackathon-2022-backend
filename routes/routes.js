var express = require("express");
var formRouter = require("./form/routes");
var linesRouter = require("./lines/routes");

var appRouter = express.Router();

appRouter.use("/form", formRouter);
appRouter.use("/lines", linesRouter);

module.exports = appRouter;
