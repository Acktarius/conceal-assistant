//get system infOSp
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const winsc = require('winsc');
const semver = require('semver');
const Promise = require('bluebird');
const fetch = require('node-fetch');
const { afterUntil , beforeUntil } = require('./forMiner/tools.js');
const { wDir , mPath } = require('./infoM.js');
const { smName , osN } = require('./checkOs.js');
//Declaration
const mapV = new Map();
//Main
const infOSp = async (req, res, next) => {


  try {
        const response = await fetch('https://github.com/ConcealNetwork/conceal-core/releases');
        const body = await response.text();
        
        let versionLatest = afterUntil(body, "Conceal Core CLI v", "<");
        versionLatest = semver.valid(versionLatest) ? versionLatest : "unknown";
        mapV.set('latest', versionLatest);
        fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
          if (err) {
            console.log("issue reading infOSp.json file");
          } else {

            const extractInfOSp = JSON.parse(contents);
            let os = JSON.parse(JSON.stringify(extractInfOSp[0])).os;
            let gwd = JSON.parse(JSON.stringify(extractInfOSp[0])).gwd;
            let isSGi = JSON.parse(JSON.stringify(extractInfOSp[0])).isSGi;
            let isSMi = JSON.parse(JSON.stringify(extractInfOSp[0])).isSMi;
            mapV.set('os', os);
            mapV.set('gwd', gwd);
            mapV.set('isSGi', isSGi);
            mapV.set('isSMi', isSMi);

              if (fs.existsSync(gwd)) {
                fs.readFile(`${gwd}config.json`, 'utf8', function(err, contents) {
                    if (err) {
                    console.log("issue reading config.json file")
                    } else {
                    const config = JSON.parse(contents);                                                                  //daemon path upgrade ?
                    if (config.node.path) {
                      if (os == "linux") {                                                                                // linux
                      let concealDpath = (config.node.path).slice(0, (config.node.path).search("conceal-core"));
                      mapV.set('Dpath', concealDpath);
                        if (!fs.existsSync(concealDpath+"conceal-core/build/version/version.h")) {
                        mapV.set('Inst', "unknown");
                        mapV.set('upgrade', false);
                        } else {
                        let versionInst = fs.readFileSync(concealDpath+"conceal-core/build/version/version.h", 'utf8');
                        versionInst = afterUntil(versionInst, 'PROJECT_VERSION "', '"');
                        versionInst = (semver.valid(versionInst)) ? versionInst : "unknown";
                        mapV.set('Inst', versionInst);
                        let upgrade = ((versionInst == "unknown") || (versionLatest == "unknown")) ? false : (semver.gt(versionLatest, versionInst)) ?  true : false;
                        mapV.set('upgrade', upgrade);
                        let message = (upgrade === false) ? "cannot upgrade" : "";
                        mapV.set('message', message);
                        }
                      } else if (os == "win") {                                                                            // windows   
                          mapV.set('Inst', "unknown");
                        let concealDpath = (config.node.path).slice(0, (config.node.path).search('conceald'));
                        mapV.set('Dpath', concealDpath);
                      } else {
                        mapV.set('Inst', "unknown");
                        mapV.set('Dpath', "unknown");
                        mapV.set('upgrade', false);
                      }    
                      } else {                                                                                              // in case there is no node path (default mode)
                        if (fs.existsSync(gwd+"conceald.exe")) {
                          mapV.set('Dpath', gwd);
                        } else {
                          mapV.set('Dpath', "unknown");
                        }
                        mapV.set('Inst', "unknown");
                        mapV.set('upgrade', false);
                    }
                    if (config.node.autoUpdate && (config.node.autoUpdate === true )) {                                     // in case auto update is Here && True
                      mapV.set('autoUpdate', config.node.autoUpdate);
                      mapV.set('upgrade', false);                                                                           // guardian auto update overpowers assistant
                      mapV.set('message', "upgrade is set automatic already");

                         } else  {
                            mapV.set('autoUpdate', false);
                        }                                                                                                   //Miner
                        wDir().then((minerdir) => {
                          mapV.set('wDir', minerdir);
                            mPath().then((minerpath) => {
                            mapV.set('mPath', minerpath);
                            fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify(Object.fromEntries(mapV), null, 2));
                            });
                        });
  
                    }}); 
                } else {
                  console.log("something is wrong with guardian");
                  mapV.set('upgrade', false);
                  wDir().then((minerdir) => {
                    mapV.set('wDir', minerdir);
                      mPath().then((minerpath) => {
                      mapV.set('mPath', minerpath);
                      fs.writeFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify(Object.fromEntries(mapV), null, 2));
                      //fs.appendFileSync(path.join(__dirname, '..' , 'data' , 'infOSp.json'), JSON.stringify(Object.fromEntries(mapV), null, 2));
                      });
                  });

                  }
                next();
              }})
              
      } catch (err) {
          console.error(err);
          return next();
        }
}

module.exports = { infOSp }
