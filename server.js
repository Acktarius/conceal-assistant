// server.js

//Load environment variable
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


//Required External Modules
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require('method-override');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



//Required Middlewares
const { checkLinuxOs } = require('./middleware/checkOs.js')
const registerController = require('./controllers/registerController');
const authController = require('./controllers/authController');
const verifyJWT = require('./middleware/verifyJWT');
const renderG = require('./middleware/serviceCheckRender');
const renderP = require('./middleware/startstopRender');
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


app.use(methodOverride('_method'));
app.use(express.json());
app.use(cookieParser());

//Routes Definitions
// access via routes.js in routes folder
app.use('/', itinerary);
app.use('/refresh', require('./routes/refresh')) //offers the option to recreate a token based on refresh token


app.post("/register", registerController.handleNewUser);

app.post("/login(.html)?", authController.handleLogin);
//Any route below that will require access Token AND an OS check = Linux

     
//Main page handling
app.get("/main", verifyJWT, checkLinuxOs, renderG.main);
   
  
  //miner Deactivation handling
  app.get("/minerd", verifyJWT, renderG.minerD);
  app.post("/minerd", verifyJWT, renderP.minerStop);
   
   //miner Activation handling
  app.get("/minera", verifyJWT, renderG.minerA); 
  app.post("/minera", verifyJWT, renderP.minerStart);

  //guardian Node Deactivation handling
  app.get("/guardiand", verifyJWT, renderG.guardianD);
  
  app.post("/guardiand", verifyJWT, renderP.guardianStop);
   
   //guardian node Activation handling
  app.get("/guardiana", verifyJWT, renderG.guardianA); 
  app.post("/guardiana", verifyJWT, renderP.guardianStart);

//logout
  app.get("/logout", logoutController.handleLogout, (req, res) => { res.redirect("/index") }); 


//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });