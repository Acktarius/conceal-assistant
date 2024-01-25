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
//Windows
      if (extractInfOSp.os == "win"){
  const guardianRunningP = winsc.status('ConcealGuardian');
  const minerRunningP = winsc.status('ConcealMining');
  Promise.allSettled([guardianRunningP, minerRunningP]).then((results) => {
    const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField;
    const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField;
    console.log(mr);
  let upgrade = extractInfOSp.upgrade
  ccx.info()
  .then((node) => { 
  res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: node.height, nodeStatus: node.status });
  }) 
  .catch((err) => { 
    res.render("main", { title: "main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: upgrade, nodeHeight: "?", nodeStatus: "?" });    
       })
})
// Linux
      } else if (extractInfOSp.os == "linux") {
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
      } else {
        console.log("Operating System not recognise");
        res.redirect('/index');
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
        fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
          if (err) {
            console.log("issue reading infOSp.json file");
            logEvents("issue reading infOSp.json file");
            //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
          } else {
            const extractInfOSp = JSON.parse(contents); 
      //Windows
            if (extractInfOSp.os == "win") {
      
              const guardianRunningP = winsc.status('ConcealGuardian');
              const minerRunningP = winsc.status('ConcealMining');
              Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
                    const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField;
                    res.render("minerd", { title: "Miner", minerstatus: mr, version: pjson.version });   
                    }); 
      //Linux        
            } else if (extractInfOSp.os == "linux") {
              const guardianRunningP = sys.checkActive('ccx-guardian');
              const minerRunningP = sys.checkActive('ccx-mining');
            Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
              const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
              res.render("minerd", { title: "Miner", minerstatus: mr, version: pjson.version });   
        }); 

            } else {
            console.log("Operating System not recognise");
            res.redirect('/index');
          }}
        })}
//Miner activation
const minerA = (req, res) => {
  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
//Windows
      if (extractInfOSp.os == "win") {

        const guardianRunningP = winsc.status('ConcealGuardian');
        const minerRunningP = winsc.status('ConcealMining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
              const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField;
              res.render("minera", { title: "Miner", minerstatus: mr, version: pjson.version });   
              }); 
//Linux        
      } else if (extractInfOSp.os == "linux") {
        const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("minera", { title: "Miner", minerstatus: mr, version: pjson.version });   
  }); 

      } else {
      console.log("Operating System not recognise");
      res.redirect('/index');
    }}
  })}

//Miner is not active so we can go next
const minerDnext = (req, res, next) => {
  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
//Windows
      if (extractInfOSp.os == "win") {
        const guardianRunningP = winsc.status('ConcealGuardian');
        const minerRunningP = winsc.status('ConcealMining');
      Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
             const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField;
             if (mr != "RUNNING") {
              return next();
             } else {
            res.status(403).render('40x', { erreur: 'unauthorized when miner is running', version: pjson.version });
             }
            }); 
//Linux        
      } else if (extractInfOSp.os == "linux") {
        const guardianRunningP = sys.checkActive('ccx-guardian');
      const minerRunningP = sys.checkActive('ccx-mining');
      Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
             const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
             if (mr != "active") {
              return next();
             } else {
            res.status(403).render('40x', { erreur: 'unauthorized when miner is running', version: pjson.version });
             }
            });   
      } else {
      console.log("Operating System not recognise");
      res.redirect('/index');
    }}
  })}

//guardian Node Deactivation
const guardianD = (req, res) => {
  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
//Windows
      if (extractInfOSp.os == "win") {

        const guardianRunningP = winsc.status('ConcealGuardian');
        const minerRunningP = winsc.status('ConcealMining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
               const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField;
              // const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
              res.render("guardiand", { title: "Node", guardianstatus: gr, version: pjson.version });   
              }); 
//Linux        
      } else if (extractInfOSp.os == "linux") {

  const guardianRunningP = sys.checkActive('ccx-guardian');
  const minerRunningP = sys.checkActive('ccx-mining');
  Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
         const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
        // const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
        res.render("guardiand", { title: "Node", guardianstatus: gr, version: pjson.version });   
        }); 
      } else {
      console.log("Operating System not recognise");
      res.redirect('/index');
    }}
  })}

//guardian node activation
const guardianA = (req, res) => {
  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
//Windows
      if (extractInfOSp.os == "win") {

        const guardianRunningP = winsc.status('ConcealGuardian');
        const minerRunningP = winsc.status('ConcealMining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
               const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField;
              // const mr = JSON.parse(JSON.stringify(results[1]))._settledValueField.slice(0,6);
              res.render("guardiana", { title: "Node", guardianstatus: gr, version: pjson.version });   
              }); 
//Linux        
      } else if (extractInfOSp.os == "linux") {

        const guardianRunningP = sys.checkActive('ccx-guardian');
        const minerRunningP = sys.checkActive('ccx-mining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
               const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
              res.render("guardiana", { title: "Node", guardianstatus: gr, version: pjson.version });   
              });    
      } else {
      console.log("Operating System not recognise");
      res.redirect('/index');
    }
  }
  })}



//guardian is not active so we can go next
const guardianDnext = (req, res, next) => {
  fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      console.log("issue reading infOSp.json file");
      logEvents("issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents); 
//Windows
      if (extractInfOSp.os == "win") {
        const guardianRunningP = winsc.status('ConcealGuardian');
        const minerRunningP = winsc.status('ConcealMining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
               const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField;
               if (gr != "RUNNING") {
                return next();
               } else {
              res.status(403).render('40x', { erreur: 'unauthorized when guardian is running', version: pjson.version });
               }
              }); 
//Linux        
      } else if (extractInfOSp.os == "linux") {
        const guardianRunningP = sys.checkActive('ccx-guardian');
        const minerRunningP = sys.checkActive('ccx-mining');
        Promise.allSettled([guardianRunningP,minerRunningP]).then((results) => {
       const gr = JSON.parse(JSON.stringify(results[0]))._settledValueField.slice(0,6);
       if (gr != "active") {
        return next();
       } else {
      res.status(403).render('40x', { erreur: 'unauthorized when guardian is running', version: pjson.version });
       }
      }); 
      } else {
      console.log("Operating System not recognise");
      res.redirect('/index');
    }
  }
  })}


module.exports = { main , minerD , minerA , minerDnext , guardianD , guardianA , guardianDnext };


















