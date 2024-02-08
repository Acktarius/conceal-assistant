//get service status and prepare render
const sys = require('sysctlx');
const winsc = require('winsc');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Promise = require('bluebird');
const pjson = require('pjson');
const { ccx } = require('./forNode/concealApi');
const logAgent = require('./logEvents');
const { urlNode , urlMiner , localIp } = require('./localIpUrl');
const { sgName, smName , osN } = require('./checkOs.js');
//declarations and Functions
//const osName = process.platform;

const guardianRunningP = (o) => {
  if (o == "win") {
    return winsc.status(sgName(osN()));
  } else if (o == "linux") {
    return sys.checkActive(sgName(osN()));
  }
}
const minerRunningP = (o) => {
  if (o == "win") {
    return winsc.status(smName(osN()));
  } else if (o == "linux") {
    return sys.checkActive(smName(osN()));
  }
}

//Main
const main = (req, res) => {
  Promise.allSettled([guardianRunningP(osN()), minerRunningP(osN())]).then((results) => {
    const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0, 6);
    const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0, 6);
    fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
      if (err) {
        console.log("issue reading infOSp.json file");
        res.render("main", { title: "Main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, localIp: localIp, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
      } else {
        const extractInfOSp = JSON.parse(contents);
        let os = extractInfOSp.os;
        let upgrade = extractInfOSp.upgrade;
        let isSGi = extractInfOSp.isSGi;
        let isSMi = extractInfOSp.isSMi;
        ccx.info()
        .then((node) => { 
        res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, localIp: localIp, version: pjson.version, os: os, upgrade: upgrade, isSGi: isSGi, isSMi: isSMi, nodeHeight: node.height, nodeStatus: node.status });
        }) 
        .catch((err) => { 
          console.log("conceal-api cannot fetch");       // for debug to be remove
          res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, localIp: localIp, version: pjson.version, os: os, upgrade: upgrade, isSGi: isSGi, isSMi: isSMi, nodeHeight: "?", nodeStatus: "?" });    
              })
      }})
})
};
//Miner Deactivation page get
const minerD = (req, res) => {
  try {
    minerRunningP(osN()).then((results) => {
      const mr = results.slice(0,6);
      res.render("minerd", { title: "Miner", minerstatus: mr, version: pjson.version });    
    });        
    } catch (err) {
      console.log("Operating System not recognize or couldn't get Service status");
      console.error(err);
      res.redirect('/index');
    }
}
//Miner activation page get
const minerA = (req, res) => {
  try {
    minerRunningP(osN()).then((results) => {
      const mr = results.slice(0,6);
      res.render("minera", { title: "Miner", minerstatus: mr, version: pjson.version });    
    });        
    } catch (err) {
      console.log("Operating System not recognize or couldn't get Service status");
      console.error(err);
      res.redirect('/index');
    }
}

//Miner is not active so we can go next
const minerDnext = (req, res, next) => {
  try {
    minerRunningP(osN()).then((results) => {
      const mr = results.slice(0,6);
      if ((mr != "RUNNIN") || (mr != "active")) {
        return next();
       } else {
      res.status(403).render('40x', { erreur: 'unauthorized when miner is running', version: pjson.version });
       }
      });     
    } catch (err) {
      console.log("Operating System not recognize or couldn't get Service status");
      console.error(err);
      res.redirect('/index');
    }
}

//guardian Node Deactivation
const guardianD = (req, res) => {
  try {
      guardianRunningP(osN()).then((results) => {
        const gr = results.slice(0,6);
        res.render("guardiand", { title: "Node", guardianstatus: gr, version: pjson.version });   
      });        
      } catch (err) {
        console.log("Operating System not recognize or couldn't get Service status");
        console.error(err);
        res.redirect('/index');
      }
}

//guardian node activation
const guardianA = (req, res) => {
  try{
    guardianRunningP(osN()).then((results) => {
      const gr = results.slice(0,6);
      res.render("guardiana", { title: "Node", guardianstatus: gr, version: pjson.version });   
    });        
  } catch (err) {
      console.log("Operating System not recognize or couldn't get Service status");
      console.error(err);
      res.redirect('/index');
    };
}

//guardian is not active so we can go next
const guardianDnext = (req, res, next) => {
  try{
    guardianRunningP(osN()).then((results) => {
      const gr = results.slice(0,6);
      if ((gr != "RUNNIN") || (gr != "active")) {
        return next();
       } else {
      res.status(403).render('40x', { erreur: 'unauthorized when guardian is running', version: pjson.version });  
       }});        
  } catch (err) {
      console.log("Operating System not recognize or couldn't get Service status");
      console.error(err);
      res.redirect('/index');
    };
}

module.exports = { main , minerD , minerA , minerDnext , guardianD , guardianA , guardianDnext };


















