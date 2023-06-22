const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const pjson = require('pjson');
const semver = require('semver');
const fetch = require('node-fetch');
const logEvents = require('../logEvents.js');
const daemonUpdate = require('./daemonUpdate.js')
const { afterUntil } = require('../forMiner/tools.js');
const { coreVersion } = require('../coreVersion.js')

const guardianGet = async (req, res) => {
      if (!fs.existsSync('/etc/systemd/system/ccx-guardian.service')) {
      console.log("guardian service doesn't exist or not named properly");
      } else {
        try {
          const data = await fsPromises.readFile('/etc/systemd/system/ccx-guardian.service', 'utf8');
              let begin = data.search("WorkingDirectory=");
              if (!begin) {
                  console.log("can't find path");
              } else {
              const { afterUntil } = require('../forMiner/tools.js');
              let gwd = afterUntil(data, "WorkingDirectory=", "\n");
              gwd = (gwd.charAt(gwd.length-1) != "/") ? (gwd + "/") : gwd;
              if (fs.existsSync(gwd)) {
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
              } else {
            console.log("can't reach guardian working directory")
              }
            }
        } catch (err) {
                console.error(err);
                res.status(403).render('40x', { erreur: 'issue to reach config file' });     
        }
}};


const guardianPost = async (req, res) => {
  const { conceald, name, feeaddr, apiport, discordurl } = req.body;
try {
  const data = await fsPromises.readFile('/etc/systemd/system/ccx-guardian.service', 'utf8');
  let begin = data.search("WorkingDirectory=");
  if (!begin) {
      console.log("can't find path");
  } else {
  const { afterUntil } = require('../forMiner/tools.js');
  let gwd = afterUntil(data, "WorkingDirectory=", "\n");
  gwd = (gwd.charAt(gwd.length-1) != "/") ? (gwd + "/") : gwd;
    if (fs.existsSync(gwd)) {
      fs.readFile(`${gwd}config.json`, 'utf8', function(err, contents) {
      if (err) {
      console.log("issue reading config.json file")
      } else {
      const config = JSON.parse(contents);

      let concealdOg = ("node" in config) ? config.node.path : "";
      let nameOg = ("node"in config) ? config.node.name : "";
      let feeaddrOg = ("node" in config) ? config.node.feeAddr : "";
      let apiportOg = ("api" in config) ? config.api.port : "";
      let discordurlOg = ("error.notify.discord.url" in config) ? config.error.notify.discord.url : "";

//Path Check  
if (concealdOg != "") {
if (!(fs.existsSync(conceald)) || !(conceald.endsWith("conceald"))) {
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
logEvents('guardian config.json file modified');
res.redirect('/main');  

    }})

} else {
console.log("can't reach guardian working directory")
}
}
} catch (err) {
  console.error(err);
}
}

const concealdGet = async (req, res) => {
  try {
    fs.readFile(path.join(__dirname, ".." , ".." , "data" , "coreV.json"), 'utf8', function(err, contents) {
     if (err) {
     console.log("issue reading coreV.json file")
     } else {
     const coreV = JSON.parse(contents);
     let upgrade = ((coreV.Inst == "unknown") || (coreV.latest == "unknown")) ? false : (semver.gt(coreV.latest, coreV.Inst)) ?  true : false;
     if (upgrade == true ) { 
      console.log("node is due for an update");
     }
    let message = (upgrade === false) ? "cannot upgrade" : "";

    res.render("csettings", { title: "Daemon Settings", version: pjson.version , concealdpath: coreV.Dpath , upgrade: upgrade , version_inst: coreV.Inst , version_avail: coreV.latest ,  message: message });
    
    }
 });
  } catch (err) {
    console.error(err);
  }
  }    

//Conceal core deamon Post
const concealdPost = async (req, res) => {
  const { concealdpath } = req.body;

    if (!fs.existsSync(concealdpath + "conceal-core")) {
      return res.status(500).render('40x', { title: 'error 500' , erreur: 'issue to locate folder' });
    } else {
      console.log("path is valid");
      daemonUpdate(concealdpath);
      logEvents("conceal core upgraded to latest version")
      res.redirect('/main');  
    }
  }


module.exports = { guardianGet , guardianPost , concealdGet , concealdPost } 