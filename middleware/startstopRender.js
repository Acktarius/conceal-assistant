//Post to start or stop and prepare redirect
const fs = require('fs');
const path = require('path');
const sys = require('sysctlx');
const winsc = require('winsc');
const Promise = require('bluebird');
const { sgName } = require('./checkOs.js')

//Miner Deactivation
const minerStop = (req, res) => {
        const minerStoppingP = sys.stop('ccx-mining');  
        minerStoppingP.then((stop) => {
        console.log('stopping Miner');
        console.log(stop); 
        res.status(200).redirect('/main#Miner');
    })}

//Miner Activation
const minerStart = (req, res) => {
    const minerStartingP = sys.start('ccx-mining');
    minerStartingP.then((start) => {
    console.log('starting miner');
    console.log(start);
    res.status(200).redirect('/main#Miner');
    })}


//Guardian Node Deactivation
const guardianStop = (req, res) => {
    fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
        if (err) {
          console.log("issue reading infOSp.json file");
          logEvents("issue reading infOSp.json file");
          //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
        } else {
          const extractInfOSp = JSON.parse(contents); 
    //Windows
          if (extractInfOSp.os == "win") {
            console.log (sgName(extractInfOSp.os))
            const guardianStoppingP = winsc.stop('ConcealGuardian');
            guardianStoppingP.then((stop) => {
                console.log(`stopping guardian node ${stop}`);
                res.status(200).redirect('/main#Node');
                })
    //Linux
          } else if (extractInfOSp.os == "linux") {
        const guardianStoppingP = sys.stop('ccx-guardian'); 
        guardianStoppingP.then((stop) => {
        console.log(`stopping guardian node ${stop}`);
        res.status(200).redirect('/main#Node');
        })}
    }
    })}

//Guardian Node Activation
const guardianStart = (req, res) => {
    fs.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8', function (err, contents) {
        if (err) {
            console.log("issue reading infOSp.json file");
            logEvents("issue reading infOSp.json file");
            //res.render("main", { title: "Main", guardianstatus: "?", minerstatus: "?", urlN: urlNode, urlM: urlMiner, version: pjson.version, upgrade: "?", nodeHeight: "?", nodeStatus: "?" });
        } else {
            const extractInfOSp = JSON.parse(contents); 
    //Windows
            if (extractInfOSp.os == "win") {
            const guardianStartingP = winsc.start('ConcealGuardian');
            guardianStartingP.then((start) => {
                console.log(`starting guardian node ${start}`);
                res.status(200).redirect('/main#Node');
                })
    //Linux
            } else if (extractInfOSp.os == "linux") {
            const guardianStartingP = sys.start('ccx-guardian');
            guardianStartingP.then((start) => {
                console.log(`starting guardian node ${start}`);
            res.status(200).redirect('/main#Node');
        })}
    }
    })}

module.exports = { minerStop , minerStart , guardianStop , guardianStart }      