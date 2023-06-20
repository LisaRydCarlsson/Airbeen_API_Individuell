const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkProperty } = require("../utils.js");
const { findUsers } = require("../users/users.js");
const { isAdmin } = require("../middlewares/auth.js");

const router = express.Router();

module.exports = router;
