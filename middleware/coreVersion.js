//get system info
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const semver = require('semver');
const fetch = require('node-fetch');
const { afterUntil } = require('./forMiner/tools.js');

const mapV = new Map();

const coreVersion = async (req, res, next) => {

    try {
        const response = await fetch('https://github.com/ConcealNetwork/conceal-core/releases');
        const body = await response.text();
        
        let versionLatest = afterUntil(body, "Conceal Core CLI v", "<");
        versionLatest = semver.valid(versionLatest) ? versionLatest : "unknown";
        mapV.set('latest', versionLatest);
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
                      mapV.set('Dpath', concealDpath);
                      let versionInst = fs.readFileSync(concealDpath+"conceal-core/build/version/version.h", 'utf8');
                      versionInst = afterUntil(versionInst, 'PROJECT_VERSION "', '"');
                      versionInst = (semver.valid(versionInst)) ? versionInst : "unknown";
                      mapV.set('Inst', versionInst);
                      let upgrade = ((versionInst == "unknown") || (versionLatest == "unknown")) ? false : (semver.gt(versionLatest, versionInst)) ?  true : false;
                      mapV.set('upgrade', upgrade);
                      let message = (upgrade === false) ? "cannot upgrade" : "";
                      
                      fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'coreV.json'), JSON.stringify(Object.fromEntries(mapV), null, 2));
                      return next();  
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



module.exports = { coreVersion }