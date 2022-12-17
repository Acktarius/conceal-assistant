const express = require('express')
const router = express.Router()
const { noUser } = require('../middleware/usersEmpty')


// main index page
router.get("^/$|/index(.html)?", (req, res) => { 
  res.render("index", { noUser: noUser });
  });
//Login Page
  router.get("/login(.html)?", (req, res) => {
    res.render("login", { title: "Login" });
  });

//Register Page
  router.get("/register", (req, res) => {
    if (noUser) {
    res.render("register", { title: "Register" })
    } else {
      res.status(403).render('40x', { erreur: `Forbidden` });
    }
  });

  module.exports = router