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
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const sys = require('sysctlx');


//Required Middlewares
const { checkLinuxOs } = require('./middleware/checkOs.js')
const registerController = require('./controllers/registerController');
const authController = require('./controllers/authController');
const verifyJWT = require('./middleware/verifyJWT');
const renderX = require('./middleware/serviceCheck');
const { urlNode , urlMiner } = require('./middleware/localIpUrl');
const logoutController = require('./controllers/logoutController');

//App Variables
const app = express();
const port = process.env.PORT || "3500"; 

const itinerary = require('./routes/routes');
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

app.use(methodOverride('_method'));
app.use(express.json());
app.use(cookieParser());

//Routes Definitions
// access via routes.js in routes folder


app.use('/', itinerary);
//app.use('/register', require('./routes/register'))
//app.use('/login', require('./routes/auth'))

app.use('/refresh', require('./routes/refresh')) //offers the option to recreate a token based on refresh token
app.get('/logout', logoutController.handleLogout, (req, res) => {
  res.render("index");
}); 

app.post("/register", registerController.handleNewUser);

app.post("/login(.html)?", authController.handleLogin);
//Any route below that will require access Token AND an OS check = Linux

//app.use(verifyJWT);
//app.use(checkLinuxOs);
//Main page handling for trying purpose
/*
app.get("/maintry", verifyJWT, (req, res) => {
  res.render("maintry",  { guardianstatus: 'active' , minerstatus: 'active' });
});
*/
     


//Main page handling
app.get("/main", verifyJWT, checkLinuxOs, renderX.main);
   
  
  //miner Deactivation handling
  app.get("/minerd", verifyJWT, renderX.minerd);
  
    app.post("/minerd(.html)?", (req, res) => {
        const minerStoppingP = sys.stop('ccx-mining');
        
      minerStoppingP.then((stop) => {
      console.log('stopping miner');
      console.log(stop);
      res.redirect("/main");
      })
    
    });
   
   //miner Activation handling
  app.get("/minera", verifyJWT, renderX.minera); 
    
    app.post("/minera(.html)?", verifyJWT, (req, res) => {
        const minerStartingP = sys.start('ccx-mining');
        
      minerStartingP.then((start) => {
      console.log('starting miner');
      console.log(start);
      res.redirect("/main");
      })
    
    });


//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });