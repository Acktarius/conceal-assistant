//get service status and prepare render
const sys = require('sysctlx');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const pjson = require('pjson');
const { coreVersion } = require('./coreVersion.js')
const { urlNode , urlMiner } = require('./localIpUrl');


//Main
const main = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
         coreVersion();
         fs.readFile(path.join(__dirname, ".." , "data" , "coreV.json"), 'utf8', function(err, contents) {
          if (err) {
          console.log("issue reading coreV.json file")
          } else {
          const coreV = JSON.parse(contents);
          res.render("main", { title: "Main", guardianstatus: gr , minerstatus: mr , urlN: urlNode , urlM: urlMiner , version: pjson.version , upgrade: coreV.upgrade});
          }
      });
       
        });
      }
//Miner Deactivation
const minerD = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minerd", { title: "Miner", minerstatus: mr });   
        }); 
      }
//Miner activation
const minerA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { title: "Miner", minerstatus: mr });   
        });  
      }

//Miner is not active so we can go next
const minerDnext = (req, res, next) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
         if (mr != "active") {
          return next();
         } else {
        res.status(403).render('40x', { erreur: 'unauthorized when miner is running' });
         }
        });  
      }
      
//guardian Node Deactivation
const guardianD = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiand", { title: "Node", guardianstatus: gr });   
        }); 
      }
//guardian node activation
const guardianA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiana", { title: "Node", guardianstatus: gr });   
        });  
      }

//guardian is not active so we can go next
const guardianDnext = (req, res, next) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
         if (gr != "active") {
          return next();
         } else {
        res.status(403).render('40x', { erreur: 'unauthorized when guardian is running' });
         }
        });  
      }


module.exports = { main , minerD , minerA , minerDnext , guardianD , guardianA , guardianDnext };
