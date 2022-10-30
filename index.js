// index.js

//Load environment variable
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

//Required External Modules
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const users = [];

const initializePassport = require('./passport-config.js')
initializePassport(
  passport, 
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

//App Variables
const app = express();
const port = process.env.PORT || "3500"; 

const itenerary = require('./routes/routes')

//App Configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// access via routes.js in routes folder
app.use('/', itenerary)

//Routes Definitions

app.post("/login", passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect("/login")
  } catch (error) {
    res.redirect("/register")
  }
  console.log(users)
  });

//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });