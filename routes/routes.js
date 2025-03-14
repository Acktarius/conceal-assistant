//Copyright © 2022-2025, @Acktarius, All Rights Reserved
const express = require('express');
const router = express.Router();
const { checkEnv } = require('../middleware/checkEnv');
const { alreadyLoggedIn } = require('../controllers/alreadyLoggedIn');
const pjson = require('pjson');
const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) { this.users = data }
};
// main index page
router.get("^/$|/index(.html)?", checkEnv, (req, res) => { 
  const noUser = (usersDB.users.length === 0) ? true : false;
  res.render("index", { title: "index", noUser: noUser, version: pjson.version });
  }); 
//Login Page
  router.get("/login(.html)?", alreadyLoggedIn, (req, res) => {
    // Set security headers
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    
    res.render("login", { title: "Login" , version: pjson.version });
  });
//Register Page
  router.get("/register", (req, res) => {
    // Set security headers
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    
    if (usersDB.users.length === 0) {
      res.render("register", { title: "Register" , version: pjson.version })
    } else {
      res.status(403).render('40x', { erreur: `Forbidden` });
    }
  });
  //Login Page
  router.get("/licence(.html)?", (req, res) => {
    res.render("licence", { title: "Licence" , version: pjson.version });
  });
  //mainz Page
    router.get("/mainz(.html)?", (req, res) => {
      res.render("mainz", { title: "main loading" , version: pjson.version });
    });
  //noAPI Page
  router.get("/noapi(.html)?", (req, res) => {
    res.render("noapi", { title: "Api ?" , version: pjson.version });
  });


  module.exports = router