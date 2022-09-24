var express = require("express");
var formEntry = require("./formEntry");

var router = express.Router();

router.post("/", formEntry);

module.exports = router;
