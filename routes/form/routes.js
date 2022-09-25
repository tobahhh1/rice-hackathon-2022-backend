var express = require("express");
const autocomplete = require("./autocomplete");
var formEntry = require("./formEntry");

var router = express.Router();

router.get("/autocomplete/:input", autocomplete);

router.post("/", formEntry);

module.exports = router;
