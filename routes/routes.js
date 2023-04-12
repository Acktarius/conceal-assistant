const express = require('express')
const router = express.Router()
//const { noUser } = require('../middleware/usersEmpty')
const { checkEnv } = require('../middleware/checkEnv')
const { alreadyLoggedIn } = require('../controllers/alreadyLoggedIn')

const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) { this.users = data }
}

// main index page
router.get("^/$|/index(.html)?", checkEnv, (req, res) => { 
  const noUser = (usersDB.users.length === 0) ? true : false;
  res.render("index", { title: "index", noUser: noUser });
  }); 
//Login Page
  router.get("/login(.html)?", alreadyLoggedIn, (req, res) => {
    res.render("login", { title: "Login" });
  });

//Register Page
  router.get("/register", (req, res) => {
    const noUser = (usersDB.users.length === 0) ? true : false;
    if (noUser) {
    res.render("register", { title: "Register" })
    } else {
      res.status(403).render('40x', { erreur: `Forbidden` });
    }
  });

  //Login Page
  router.get("/licence(.html)?", (req, res) => {
    res.render("licence", { title: "Licence" });
  });

  //noAPI Page
  router.get("/noapi(.html)?", (req, res) => {
    res.render("noapi", { title: "Api ?" });
  });

  module.exports = router