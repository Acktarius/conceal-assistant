const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { checkAuthenticated } = require('../middleware/checkAuth');
const { checkNotAuthenticated } = require('../middleware/checkAuth');
const router = express.Router();

// main index page
router.get("^/$|/index(.html)?", (req, res) => {
  res.render("index", { title: "Home" });
});
//Login Page

router.get("/login(.html)?", checkNotAuthenticated, (req, res) => {
  res.render("login", { title: "Profile" });
});


//Register Page

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register", { title: "Profile" });
});


  //Main Page
  /*
router.get("/main", (req, res) => {
    res.render("main", { title: "Profile" });
  });
*/

  module.exports = router