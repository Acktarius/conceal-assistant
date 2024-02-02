//get the OS 
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const winsc = require('winsc');
const pjson = require('pjson');
const { afterUntil , beforeUntil } = require('./forMiner/tools.js');

//declarations
const osName = process.platform;
//functions
//ServiceName function for Guardian
const sgName = (o) => {
  if (o == "win") {
    return "ConcealGuardian";
  } else if (o == "linux") {
    return "ccx-guardian";
  }
}
//ServiceName function for Miner
const smName = (o) => {
  if (o == "win") {
    return "ConcealMining";
  } else if (o == "linux") {
    return "ccx-mining";
  }
}
//osName basic function 
const osN = () => {
if (osName.startsWith('linux')) { 
  return "linux";
} else if (osName.startsWith('win')) {
  return "win";
}
}

// is Service Installed ?
const isSi = (s) => {
  switch (osN()) {
    case 'win':
      return (winsc.exists(`${s}`));
    break;
    case "linux":
      if (!fs.existsSync(`/etc/systemd/system/${s}.service`)) {
        return false;
      } else {
        return true;
      }
    break;
    default:
      console.log ("OS not handled");
    }  
  }

//main
const checkOs = async (req, res, next) => {
 //Linux 
      if ((osN() == 'linux') || (osN() == 'win')) { 
       
        if (osN == 'win') {
          let serviceDetails = await winsc.details(`${sgName(osN())}`);
        }
//guardian path is a requirement otherwise Assistant has no purpose
/*
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

                  try {
                    isSi(sgName(osN())).then((value) => {                                                                                         // ????
                    fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify([{"os": osN(), "gwd": `${gwd}`, "isSMi": "toto", "isSGi": value }], null, 2));
                    });
                  } catch (err) {
                      console.error(err);
                    }

                  } 
                } catch (err) {
                    console.error(err);
                  }}

        next();
  //Windows 
      } else if (osN() == 'win') {
*/
        
        try {
          isSi(sgName(osN())).then((isGuardian) => {
            if (isGuardian) {
            
            switch (osN()) {
              case 'linux':
                const data = fsPromises.readFile(`/etc/systemd/system/${sgName(osN())}.service`, 'utf8');
                  let begin = data.search("WorkingDirectory=");
                  if (!begin) {
                      console.log("can't find path");
                  } else {
                  let gwd = afterUntil(data, "WorkingDirectory=", "\n");
                  gwd = (gwd.charAt(gwd.length-1) != "/") ? (gwd + "/") : gwd;
                  isSi(smName(osN())).then((isMining) => {
                    fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify([{"os": osN(), "gwd": gwd, "isSGi": isGuardian, "isSMi": isMining }], null, 2));
                    });
                  }              
              break;
              case 'win':
                let serviceDetails = winsc.details(`${sgName(osN())}`);
                serviceDetails.then((details) => {
                  let gwd = details.exePath;
                  console.log(gwd);
                  gwd = beforeUntil(gwd, "\\");
                  gwd = (gwd.charAt(0) == '"') ? (gwd.substring(1)) : gwd;
                  isSi(smName(osN())).then((isMining) => {
                    fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify([{"os": osN(), "gwd": gwd, "isSGi": isGuardian, "isSMi": isMining }], null, 2));
                    });
                });
              break;
              default:
                //shouldn't arrive in this corner
                console.log ("Cannot deal with this Operating System")
                res.redirect('/index');
            }    
          } else {
            gwd = "unknown"
            isSi(smName(osN())).then((isMining) => {
              fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify([{"os": osN(), "gwd": gwd, "isSGi": isGuardian, "isSMi": isMining }], null, 2));
              });

          }
            
            });
        } catch (err) {
          console.error(err);
        }

        next();

      } else {
      console.log ("Cannot deal with this Operating System")
      res.redirect('/index');
      };
}

const linux = async (req, res, next) => {
if (osN() == 'linux') {
  next ();
} else {
  res.status(403).render('40x', { erreur: 'unauthorized: Wrong OS', version: pjson.version });
}
}  

module.exports = { checkOs , linux , sgName , smName , osN };

