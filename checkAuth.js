//Check authentification
const express = require('express');
const passport = require('passport');
const session = require('express-session');


const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated == true) { //(req.session.passport.user === authenticate)
      return next();
    } else {
    res.redirect('/login');
    console.log(req.isAuthenticated);
    }
  };

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated == true) {
      return res.redirect('/main');
    } else {
      return next();
      console.log(req.isAuthenticated);
    }
  };

  

module.exports = { checkAuthenticated , checkNotAuthenticated };

