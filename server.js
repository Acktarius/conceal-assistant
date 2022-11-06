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
const sys = require('sysctlx');
const Promise = require('bluebird');

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
const port = process.env.PORT || "3800"; 

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
//app.use('/', itineraryPost)

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
      


//Main page handling
 app.get("/main", /*authenticateToken,*/ (req, res) => {
 
const guardianRunningP = sys.checkActive('ccx-guardian');
const minerRunningP = sys.checkActive('ccx-mining');

Promise.allSettled([
 		guardianRunningP,
 		minerRunningP
 		]).then((results) => {
 			const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
 			const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
      res.render("main", { guardianstatus: gr , minerstatus: mr }/*, { Authorization: "Bearer"+ " " + accessToken }*/);   
      }); 
      
    });
 //   });

//miner Deactivation handling
app.get("/minerd", /*authenticateToken,*/ (req, res) => {
const guardianRunningP = sys.checkActive('ccx-guardian');
const minerRunningP = sys.checkActive('ccx-mining');

Promise.allSettled([
 		guardianRunningP,
 		minerRunningP
 		]).then((results) => {
 			const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
 			const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
      res.render("minerd", { minerstatus: mr }/*, { Authorization: "Bearer"+ " " + accessToken }*/);   
      }); 
      
    });

  app.post("/minerd(.html)?", (req, res) => {
  		const minerStoppingP = sys.stop('ccx-mining');
  		
    minerStoppingP.then((stop) => {
    console.log('stopping miner');
    console.log(stop);
    res.redirect("/main");
    })
  
  });
 
 //miner Activation handling
app.get("/minera", /*authenticateToken,*/ (req, res) => {
const guardianRunningP = sys.checkActive('ccx-guardian');
const minerRunningP = sys.checkActive('ccx-mining');

Promise.allSettled([
 		guardianRunningP,
 		minerRunningP
 		]).then((results) => {
 			const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
 			const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
      res.render("minera", { minerstatus: mr }/*, { Authorization: "Bearer"+ " " + accessToken }*/);   
      }); 
      
    }); 
  
  app.post("/minera(.html)?", (req, res) => {
  		const minerStartingP = sys.start('ccx-mining');
  		
    minerStartingP.then((start) => {
    console.log('starting miner');
    console.log(start);
    res.redirect("/main");
    })
  
  });

 app.get('/logout', (req, res) => {  
  //req.logOut();
  res.redirect('/index');
})

//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
