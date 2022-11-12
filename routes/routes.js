const express = require('express');
const passport = require('passport');
const router = express.Router();

const logoutController = require('../controllers/logoutController');

// main index page
router.get("^/$|/index(.html)?", (req, res) => {
  res.render("index", { title: "Home" });
});
//Login Page

router.get("/login(.html)?", (req, res) => {
  res.render("login", { title: "Profile" });
});


//Register Page

router.get("/register", (req, res) => {
  res.render("register", { title: "Profile" });
});




  module.exports = router;