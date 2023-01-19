//get service status and prepare render
const sys = require('sysctlx');
const Promise = require('bluebird');
const { urlNode , urlMiner } = require('./localIpUrl');


//Main
const main = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("main", { guardianstatus: gr , minerstatus: mr , urlN: urlNode , urlM: urlMiner });   
        });
      }
//Miner Deactivation
const minerD = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minerd", { minerstatus: mr });   
        }); 
      }
//Miner activation
const minerA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { minerstatus: mr });   
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
        res.render("guardiand", { guardianstatus: gr });   
        }); 
      }
//guardian node activation
const guardianA = (req, res) => {
  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiana", { guardianstatus: gr });   
        });  
      }

module.exports = { main , minerD , minerA , minerDnext , guardianD , guardianA };
