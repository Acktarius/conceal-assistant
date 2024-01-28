//Copyright © 2022-2024, @Acktarius, All Rights Reserved
// server.js

//Load environment variable
require('dotenv').config()

//Required External Modules
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require('method-override');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//Required Middlewares
const { checkOs } = require('./middleware/checkOs.js');
const registerController = require('./controllers/registerController');
const authController = require('./controllers/authController');
const verifyJWT = require('./middleware/verifyJWT');
const renderG = require('./middleware/serviceCheckRender');
const renderP = require('./middleware/startstopRender');
const minerRender = require('./middleware/forMiner/minerRender');
const guardianRender = require('./middleware/forNode/guardianRender.js');
const { urlNode , urlMiner } = require('./middleware/localIpUrl');
const logoutController = require('./controllers/logoutController');
const { infOSp } = require('./middleware/infOSp.js');
const { sysInfo } = require('./middleware/sysInfo.js');
//App Variables

const publicDirectory = path.join(__dirname, "public");

const app = express();
const port = process.env.PORT || "3500"; 

const itinerary = require('./routes/routes');
const { sign } = require('crypto');

//App Configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));
app.use(express.json());
app.use(cookieParser());


//Routes Definitions
// access via routes.js in routes folder

app.use('/', itinerary);
app.use('/refresh', require('./routes/refresh')) //offers the option to recreate a token based on refresh token

app.post("/register", registerController.handleNewUser);

app.post("/login(.html)?", checkOs, infOSp, authController.handleLogin);
//Any route below that will require access Token AND an OS check = Linux

//Main page handling
//app.get("/main", verifyJWT, checkOs, infOSp, renderG.main);
app.get("/main", verifyJWT, renderG.main);

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

  //Node Settings
  app.get("/nsettings", verifyJWT, renderG.guardianDnext, guardianRender.guardianGet);
  app.post("/nsettings", verifyJWT, renderG.guardianDnext, guardianRender.guardianPost);
  app.get("/csettings", verifyJWT, renderG.guardianDnext, guardianRender.concealdGet);
  app.post("/csettings", verifyJWT, renderG.guardianDnext, guardianRender.concealdPost);

   //Settings
   app.get("/settings", verifyJWT, sysInfo, logoutController.handleUser);

   //Miner Settings
   app.get("/msettings", verifyJWT, renderG.minerDnext, minerRender.minerGet);
   app.post("/msettings", verifyJWT, renderG.minerDnext, minerRender.modifyPost);
   app.get("/msettingsc", verifyJWT, renderG.minerDnext, minerRender.confirmGet);
   app.post("/msettingsc", verifyJWT, renderG.minerDnext, minerRender.minerInject);
   app.delete("/msettingsc", verifyJWT, renderG.minerDnext, minerRender.minerCancel);
   //Mining Software
   app.get("/msoftware", verifyJWT, renderG.minerDnext, minerRender.minerSoftGet);
   app.post("/msoftware", verifyJWT, renderG.minerDnext, minerRender.minerSoftPost);
   app.get("/msoftwarec", verifyJWT, renderG.minerDnext, minerRender.confirmSoftGet);
   app.post("/msoftwarec", verifyJWT, renderG.minerDnext, minerRender.minerSoftInject);
   app.delete("/msoftwarec", verifyJWT, renderG.minerDnext, minerRender.minerSoftCancel);
//logout
  app.get("/logout", logoutController.handleLogout);
//delete and logout User
  app.delete("/logout", logoutController.handleDeleteLogout); 

//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });