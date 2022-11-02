// server.js

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
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const sys = require('sysctlx')

const { checkAuthenticated } = require('./middleware/checkAuth');
const { checkNotAuthenticated } = require('./middleware/checkAuth');

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

const itineraryGet = require('./routes/routesGet');
const itineraryPost = require('./routes/routesPost');
const { sign } = require('crypto');


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
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
//app.use(express.json());

//Routes Definitions
// access via routesXXX.js in routes folder
app.use('/', itineraryGet)
app.use('/', itineraryPost)

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect("/login")
  } catch (error) {
    res.redirect("/register");
    console.log(error)
  }
  console.log(users)
  });
 
  
  app.post("/login(.html)?", 
    passport.authenticate('local', {
    successRedirect: '/main',
     failureRedirect: '/login',
     failureFlash: true,
       }),
       // Explicitly save the session before redirecting!
      /*
      function (req, res) {
       res.redirect('/main');
      req.session.save(() => {
        res.redirect('/main')
      })}, */
      (req, res) => {
      const username = req.body.username
      const user = { name: username }
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET )
    } 
    )
      function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403)
            req.user = user
            next ()
        })
      }      
      
const nodeRunning = sys.status(ccx-guardian);

  app.get("/main", /*authenticateToken,*/ (req, res) => {
      res.render("main"/*, { Authorization: "Bearer"+ " " + accessToken }*/);
      console.log(nodeRunning);
    });


 app.get('/logout', (req, res) => {  
  //req.logOut();
  res.redirect('/index');
})

//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });