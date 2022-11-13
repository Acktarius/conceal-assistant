//get service status
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
const minerd = (req, res) => {
  
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
const minera = (req, res) => {

  Promise.allSettled([
       guardianRunningP,
       minerRunningP
       ]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { minerstatus: mr });   
        }); 
        
      }


module.exports = { main , minerd , minera };
