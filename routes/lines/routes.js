var express = require("express");
var getLines = require("./getLines");

var router = express.Router();

router.get("/", getLines);

module.exports = router;
