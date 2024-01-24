//get service status and prepare render
const sys = require('sysctlx');
const winsc = require('winsc');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Promise = require('bluebird');
const pjson = require('pjson');
const { ccx } = require('./forNode/concealApi');
const logEvents = require('./logEvents');
const { urlNode , urlMiner } = require('./localIpUrl');

//Main

const main = (req, res) => {

  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
      if (extractInfOSp.os == "win"){
  const guardianRunningP = winsc.status('ConcealGuardian');
  guardianRunningP
.then((node) => {
  console.log(node);
  gr=node
  let upgrade = extractInfOSp.upgrade
  ccx.info()
  .then((node) => { 
  res.render("main", { title: "main", guardianstatus: gr, minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: node.height, nodeStatus: node.status });
  }) 
  .catch((err) => { 
    res.render("main", { title: "main", guardianstatus: gr, minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: "?", nodeStatus: "?" });    
       })
})
.catch((err) => { console.log(err);
})

      }

      if (extractInfOSp.os == "linux"){

      //  const coreV = JSON.parse(contents);
      const guardianRunningP = sys.checkActive('ccx-guardian');
      const minerRunningP = sys.checkActive('ccx-mining');
      Promise.allSettled([guardianRunningP, minerRunningP]).then((results) => {
        const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0, 6);
        const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0, 6);
        //let upgrade = (JSON.parse(JSON.stringify(results[2]))._settledValueField.upgrade);
        let upgrade = extractInfOSp.upgrade
        ccx.info()
          .then((node) => { 
        res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: node.height, nodeStatus: node.status });
          })
          .catch((err) => { 
        res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: "?", nodeStatus: "?" });    
           })
          })


      }


}})
};

/*
const main = (req, res) => {
  fs.readFile(path.join(__dirname, "..", "data", "coreV.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading coreV.json file");
      const guardianRunningP = sys.checkActive('ccx-guardian');
      const minerRunningP = sys.checkActive('ccx-mining');
      Promise.allSettled([guardianRunningP, minerRunningP]).then((results) => {
        const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0, 6);
        const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0, 6);
        let upgrade = false;
        res.render("main", { title: "Main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: "?", nodeStatus: "?" });
      });
    } else {
      const coreV = JSON.parse(contents);
      const guardianRunningP = sys.checkActive('ccx-guardian');
      const minerRunningP = sys.checkActive('ccx-mining');
      Promise.allSettled([guardianRunningP, minerRunningP, coreV]).then((results) => {
        const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0, 6);
        const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0, 6);
        let upgrade = (JSON.parse(JSON.stringify(results[2]))._settledValueField.upgrade);
        ccx.info()
          .then((node) => { 
        res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: node.height, nodeStatus: node.status });
          })
          .catch((err) => { 
        res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: "?", nodeStatus: "?" });    
           })

      });
    }
  });
  }
  */
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
