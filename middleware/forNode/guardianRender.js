const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const pjson = require('pjson');
const semver = require('semver');
const fetch = require('node-fetch');
const logAgent = require('../logEvents.js');
const daemonUpdate = require('./daemonUpdate.js')
const { afterUntil } = require('../forMiner/tools.js');
//const { infOSp } = require('../infOSp.js');
const { osN } = require('../checkOs.js');

//functions
const guardianGet = async (req, res) => {
  fs.readFile(path.join(__dirname, "../..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      logAgent.doubleLogEvents("trying to get guardian info","issue reading infOSp.json file");
      //res.render("main", { title: "Main", guardianstatus: gr, minerstatus: mr, urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
    } else {
      const extractInfOSp = JSON.parse(contents);
      try {
      let gwd = extractInfOSp.gwd 
        fs.readFile(`${gwd}config.json`, 'utf8', function(err, contents) {
          if (err) {
            console.log("issue reading config.json file")
           } else {
            const config = JSON.parse(contents);
              let concealDpath = ("node" in config) ? config.node.path : "";
              let nameD = ("node" in config) ? config.node.name : "";
              let feeAddr = ("node" in config) ? config.node.feeAddr : "";
              let apiPort = ("api" in config) ? config.api.port : "";
              let discordUrl = ("error" in config) ? config.error.notify.discord.url : "";
            res.render("nsettings", { title: "Guardian Settings", version: pjson.version, conceald: concealDpath, name: nameD, feeaddr: feeAddr, apiport: apiPort, discordurl: discordUrl
              });
            }});
        } catch (err) {
                console.error(err);
                res.status(403).render('40x', { erreur: 'issue to reach config file' });     
        }  
    }})
  }


const guardianPost = async (req, res) => {
  fs.readFile(path.join(__dirname, "../..", "data", "infOSp.json"), 'utf8', function (err, contents) {
    if (err) {
      logAgent.doubleLogEvents("trying to get guardian info","issue reading infOSp.json file");
    } else {
      const extractInfOSp = JSON.parse(contents);
      try {
      let gwd = extractInfOSp.gwd 
      fs.readFile(`${gwd}config.json`, 'utf8', function(err, contents) {
        if (err) {
        console.log("issue reading config.json file")
        } else {
          const { conceald, name, feeaddr, apiport, discordurl } = req.body;
        const config = JSON.parse(contents);

        let concealdOg = ("node" in config) ? config.node.path : "";
        let nameOg = ("node"in config) ? config.node.name : "";
        let feeaddrOg = ("node" in config) ? config.node.feeAddr : "";
        let apiportOg = ("api" in config) ? config.api.port : "";
        let discordurlOg = ("error.notify.discord.url" in config) ? config.error.notify.discord.url : "";

//Path Check  
if (concealdOg != "") {
    if (!(fs.existsSync(conceald)) || ( (osN() == "linux") && !(conceald.endsWith("conceald"))) || ((osN() == "win") && !(conceald.endsWith("conceald.exe")))) {
      return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: 'improper path or file' });
} else {
  config.node.path = conceald;
}
}

//wallet check
if (feeaddrOg != "") {
  if ((feeaddr.length !== 98 || !(feeaddr.startsWith("ccx7")))) {
    return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: "wallet address not valid"});
  } else {
    config.node.feeAddr = feeaddr;
  }
}
//verif port as a number
if (apiportOg != "") {
 if (isNaN(apiport)) {
  return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: 'apiport has to be a number' });
 } else {
  config.api.port = apiport;  
 }
}
//verif discord url
if (discordurlOg != "") {
  if (!(discordurl.startsWith("https://discord.com/"))) {
  return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: "not a Discord web hook or not set"});
  } else {
  config.error.notify.discord.url = discordurl;
  }
  }
if (nameOg != "") {
  config.node.name = name
}
fs.writeFileSync(`${gwd}config.json`, JSON.stringify(config, null, 2));
logAgent.doubleLogEvents("Modifying guardian config", 'guardian config.json file modified');
res.redirect('/mainz');  
    }})
}
    catch (err) {
      console.error(err);
    }
}})}

const concealdGet = async (req, res) => {
  try {
    fs.readFile(path.join(__dirname, ".." , ".." , "data" , "infOSp.json"), 'utf8', function(err, contents) {
     if (err) {
     console.log("issue reading infOSp.json file")
     } else {
     const infOSp = JSON.parse(contents);
     let upgrade = (infOSp.upgrade === true) ? ((infOSp.Inst == "unknown") || (infOSp.latest == "unknown")) ? false : (semver.gt(infOSp.latest, infOSp.Inst)) ?  true : false : false;
     if (upgrade == true ) { 
      console.log("node is due for an update");
     }
    let message = (infOSp.message) ? infOSp.message : (upgrade === false) ? "cannot upgrade" : "";

    res.render("csettings", { title: "Daemon Settings", version: pjson.version , concealdpath: infOSp.Dpath , upgrade: upgrade , version_inst: infOSp.Inst , version_avail: infOSp.latest ,  message: message });
    }
 });
  } catch (err) {
    console.error(err);
  }
}    

//Conceal core deamon Post
const concealdPost = async (req, res) => {
  const { concealdpath } = req.body;
  if (osN() == "linux") {
    if (!fs.existsSync(concealdpath + "conceal-core")) {
      return res.status(500).render('40x', { title: 'error 500' , erreur: 'issue to locate folder' });
    } else {
      console.log("path is valid");
      daemonUpdate(concealdpath);
      logAgent.doubleLogEvents("Upgrade process completed","conceal core upgraded to latest version");
      res.redirect('/mainz');  
    }
  } else {
    return res.status(503).render('40x', { title: 'error 503' , erreur: 'unavailable' });
  }
  }


module.exports = { guardianGet , guardianPost , concealdGet , concealdPost } 