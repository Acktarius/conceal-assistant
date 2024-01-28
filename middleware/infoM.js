//get Miner path

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const winsc = require('winsc');
const semver = require('semver');
const fetch = require('node-fetch');
const { afterUntil , beforeUntil } = require('./forMiner/tools.js');
const { smName , osN } = require('./checkOs.js');
//Declaration

//Functions
const wDir = async () => {
  if (osN() == "linux") {
      if (!fs.existsSync('/etc/systemd/system/ccx-mining.service')) {
          console.log("file doesn't exist");
          } else {
          try {
              const data = await fsPromises.readFile('/etc/systemd/system/ccx-mining.service', 'utf8');
                  let begin = data.search("ExecStart=");
                  if (!begin) {
                      console.log("can't find path");
                  } else {
                  //const { afterUntil, beforeUntil } = require('./tools.js');
                  let wdir = afterUntil(data, "WorkingDirectory=", "\n");
                  wdir = (wdir.charAt(wdir.length - 1) != "/") ? wdir + "/" : wdir;
                  return wdir;
                  }
              } catch (err) {
                  console.error(err);
                  }
          }    

  } else if (osN() == "win") {
      try {let miningDetails = await winsc.details(smName(osN()));
      let wdir = miningDetails.exePath;
      wdir = beforeUntil(wdir, "\\");
      wdir = (wdir.charAt(0) == '"') ? (wdir.substring(1)) : wdir;
      return wdir;
      } catch (err){
          console.error(err);
      }
  } else {
      console.log("OS unknown, file doesn't exist");
  }
}

const mPath = async () => {
  if (osN() == "linux") {
      if (!fs.existsSync('/etc/systemd/system/ccx-mining.service')) {
          console.log("file doesn't exist");
          } else {
          try {
              const data = await fsPromises.readFile('/etc/systemd/system/ccx-mining.service', 'utf8');
                  let begin = data.search("ExecStart=");
                  if (!begin) {
                      console.log("can't find path");
                  } else {
                  //const { afterUntil, beforeUntil } = require('./tools.js');
                  let mpath = afterUntil(data, "ExecStart=", "\n");
                  return mpath;
                  }
              } catch (err) {
                  console.error(err);
                  }
          }    

  } else if (osN() == "win") {
      try {
      let miningDetails = await winsc.details(smName(osN()));
      return miningDetails.exePath;
      } catch (err){
          console.error(err);
      }
  } else {
      console.log("OS unknown, file doesn't exist");
  }
}

module.exports =  {wDir , mPath };