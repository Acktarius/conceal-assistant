//get the OS 
const fs = require('fs');
const path = require('path');
const winsc = require('winsc');

const { afterUntil , beforeUntil } = require('./forMiner/tools.js');


const osName = process.platform;

const checkOs = async (req, res, next) => {
 //Linux 
      if (osName.startsWith('linux')) { 
        console.log(osName);

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
                    fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'coreV.json'), JSON.stringify([{"gwd": `${gwd}`}], null, 2));
                    } catch (err) {
                      console.error(err);
                    }

                  } 
                } catch (err) {
                    console.error(err);
                  }}
        next();
  //Windows 
      } else if (osName.startsWith('win32')) {
        console.log(osName); 
        let serviceDetails = await winsc.details('ConcealGuardian');
        let gwd = serviceDetails.exePath;
        gwd = beforeUntil(gwd, "\\");
        gwd = (gwd.charAt(0) == '"') ? (gwd.substring(1)) : gwd;
        try {
        fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'coreV.json'), JSON.stringify([{"gwd": `${gwd}`}], null, 2));
        } catch (err) {
          console.error(err);
        }

        next();
      } else {
      console.log ("Cannot deal with this Operating System")
      res.redirect('/index');
      };
}

//checkOs();


module.exports = { checkOs };

