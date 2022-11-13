//get service status and prepare render
const sys = require('sysctlx');
const Promise = require('bluebird');
const { urlNode , urlMiner } = require('../middleware/localIpUrl');

  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
//Main
const main = (req, res) => {
  
  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
   
        res.render("main", { guardianstatus: gr , minerstatus: mr , urlN: urlNode , urlM: urlMiner });   
        });
        }
//Miner Deactivation
const minerD = (req, res) => {
  
  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minerd", { minerstatus: mr });   
        }); 
      }
//Miner activation
const minerA = (req, res) => {

  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { minerstatus: mr });   
        }); 
        
      }
//guardian Node Deactivation
const guardianD = (req, res) => {
  
  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiand", { guardianstatus: gr });   
        }); 
      }
//guardian node activation
const guardianA = (req, res) => {

  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiana", { guardianstatus: gr });   
        }); 
        
      }

module.exports = { main , minerD , minerA , guardianD , guardianA };
