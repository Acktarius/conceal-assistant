const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const pjson = require('pjson');
const semver = require('semver');
const fetch = require('node-fetch');
const logEvents = require('../logEvents.js');
const daemonUpdate = require('./daemonUpdate.js')
const { afterUntil } = require('../forMiner/tools.js');

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
                res.render("nsettings", { title: "Guardian Settings",
                  version: pjson.version,
                  conceald: config.node.path, 
                  name: config.node.name , 
                  feeaddr: config.node.feeAddr,
                  apiport: config.api.port,
                  discordurl: config.error.notify.discord.url
                  })
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
        let concealdOg = config.node.path; 
        let nameOg = config.node.name; 
        let feeaddrOg = config.node.feeAddr;
        let apiportOg = config.api.port;
        let discordurlOg = config.error.notify.discord.url;

   
//Path Check  
if (!(fs.existsSync(conceald)) || !(conceald.endsWith("conceald"))) return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: 'improper path or file' });
//wallet check
  if ((feeaddr.length !== 98 || !(feeaddr.startsWith("ccx7")))) return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: "wallet address not valid"});
//verif port as a number
 if (isNaN(apiport)) return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: 'apiport has to be a number' });
//verif url
if (!(discordurl.startsWith("https://discord.com/"))) return res.status(401).render('nsettings', { title: "Guardian Settings", version: pjson.version, conceald: concealdOg , name: nameOg , feeaddr: feeaddrOg , apiport: apiportOg, discordurl: discordurlOg , message: "doesn't look like a Discord web hook"});

        config.node.path = (conceald != concealdOg)? conceald : config.node.path;
        config.node.name = (name != nameOg)? name : config.node.name;
        config.node.feeAddr = (feeaddr != feeaddrOg)? feeaddr : config.node.feeAddr;
        config.api.port = (apiport != apiportOg)? apiport : config.api.port;  
        config.error.notify.discord.url = (discordurl != discordurlOg) ? discordurl : config.error.notify.discord.url;

fs.writeFileSync(`${gwd}config.json`, JSON.stringify(config, null, 2));
logEvents('guardian config.json file modified');
res.redirect('/main');  

    }})

} else {
console.log("can't reach guardian working directory")
}
}
}

const concealdGet = async (req, res) => {
  try {
  const response = await fetch('https://github.com/ConcealNetwork/conceal-core/releases');
  const body = await response.text();
  
  let versionLatest = afterUntil(body, "Conceal Core CLI v", "<");
  versionLatest = semver.valid(versionLatest) ? versionLatest : "unknown";


  if (!fs.existsSync('/etc/systemd/system/ccx-guardian.service')) {
  console.log("guardian service doesn't exist or not named properly");
  } else {
    try {
      const data = await fsPromises.readFile('/etc/systemd/system/ccx-guardian.service', 'utf8');
          let begin = data.search("WorkingDirectory=");
          if (!begin) {
              console.log("can't find path");
          } else {
          
          let gwd = afterUntil(data, "WorkingDirectory=", "\n");
          gwd = (gwd.charAt(gwd.length-1) != "/") ? (gwd + "/") : gwd;
          if (fs.existsSync(gwd)) {
            
            fs.readFile(`${gwd}config.json`, 'utf8', function(err, contents) {
              if (err) {
              console.log("issue reading config.json file")
              } else {
              const config = JSON.parse(contents);
                let concealDpath = (config.node.path).slice(0, (config.node.path).search("conceal-core"));
                let versionInst = fs.readFileSync(concealDpath+"conceal-core/build/version/version.h", 'utf8');
                versionInst = afterUntil(versionInst, 'PROJECT_VERSION "', '"');
                versionInst = (semver.valid(versionInst)) ? versionInst : "unknown"
                
                let upgrade = ((versionInst == "unknown") || (versionLatest == "unknown")) ? false : (semver.gt(versionLatest, versionInst)) ?  true : false;

                let message = (upgrade === false) ? "cannot upgrade" : "";
              
                res.render("csettings", { title: "Daemon Settings", version: pjson.version , concealdpath: concealDpath , upgrade: upgrade , version_inst: versionInst , version_avail: versionLatest ,  message: message });
              }}); 
          } else {
            console.log("something is wrong")
          }
        }
      } catch (err) {
            console.error(err);
      }
    }
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