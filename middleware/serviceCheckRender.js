//get service status and prepare render
const sys = require('sysctlx');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Promise = require('bluebird');
const pjson = require('pjson');

const { urlNode , urlMiner } = require('./localIpUrl');


//Main
const main = (req, res) => {
  fs.readFile(path.join(__dirname, ".." , "data" , "coreV.json"), 'utf8', function(err, contents) {
    if (err) {
    console.log("issue reading coreV.json file");
    const guardianRunningP = sys.checkActive('ccx-guardian');
    const minerRunningP = sys.checkActive('ccx-mining');
    Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
           const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
           const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
           let upgrade = false; 
        res.render("main", { title: "Main", guardianstatus: gr , minerstatus: mr , urlN: urlNode , urlM: urlMiner , version: pjson.version , upgrade: upgrade});
      });
    } else {
  const coreV = JSON.parse(contents);
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP,coreV]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
         let upgrade = (JSON.parse(JSON.stringify(results[2]))._settledValueField.upgrade);  
      res.render("main", { title: "Main", guardianstatus: gr , minerstatus: mr , urlN: urlNode , urlM: urlMiner , version: pjson.version , upgrade: upgrade});
    });
      }
    });
  }
//Miner Deactivation
const minerD = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minerd", { title: "Miner", minerstatus: mr, version: pjson.version });   
        }); 
      }
//Miner activation
const minerA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { title: "Miner", minerstatus: mr, version: pjson.version });   
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
        res.status(403).render('40x', { erreur: 'unauthorized when miner is running', version: pjson.version });
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
        res.render("guardiand", { title: "Node", guardianstatus: gr, version: pjson.version });   
        }); 
      }
//guardian node activation
const guardianA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiana", { title: "Node", guardianstatus: gr, version: pjson.version });   
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
        res.status(403).render('40x', { erreur: 'unauthorized when guardian is running', version: pjson.version });
         }
        });  
      }


module.exports = { main , minerD , minerA , minerDnext , guardianD , guardianA , guardianDnext };
