const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require("path");
const bcrypt = require('bcrypt');
//const { checkAuthenticated } = require('../middleware/checkAuth');
const { checkNotAuthenticated } = require('../middleware/checkAuth');

const router = express.Router();


    

  module.exports = router