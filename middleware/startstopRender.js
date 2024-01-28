//Post to start or stop and prepare redirect
const fs = require('fs');
const path = require('path');
const sys = require('sysctlx');
const winsc = require('winsc');
const Promise = require('bluebird');
const { sgName , smName , osN } = require('./checkOs.js')

//declaration and functions
const guardianStoppingP = (o) => {
    if (o == "win") {
      return winsc.stop(sgName(osN()));
    } else if (o == "linux") {
      return sys.stop(sgName(osN()));
    }
  }
const guardianStartingP = (o) => {
    if (o == "win") {
      return winsc.start(sgName(osN()));
    } else if (o == "linux") {
      return sys.start(sgName(osN()));
    }
  }
const minerStoppingP = (o) => {
    if (o == "win") {
      return winsc.stop(smName(osN()));
    } else if (o == "linux") {
      return sys.stop(smName(osN()));
    }
  }
  const minerStartingP = (o) => {
    if (o == "win") {
      return winsc.start(smName(osN()));
    } else if (o == "linux") {
      return sys.start(smName(osN()));
    }
  }
//Miner Deactivation
const minerStop = (req, res) => { 
        minerStoppingP(osN()).then((stop) => {
        console.log(`stoping Miner: ${stop}`);
        res.status(200).redirect('/mainz');
    })}
//Miner Activation
const minerStart = (req, res) => {
    minerStartingP(osN()).then((start) => {
    console.log(`starting Miner: ${start}`);
    res.status(200).redirect('/mainz');
    })}
//Guardian Node Deactivation
const guardianStop = (req, res) => {
    guardianStoppingP(osN()).then((stop) => {
    console.log(`stopping guardian node: ${stop}`);
    res.status(200).redirect('/mainz');
    })}
//Guardian Node Activation
const guardianStart = (req, res) => {
    guardianStartingP(osN()).then((start) => {
        console.log(`starting guardian node: ${start}`);
        res.status(200).redirect('/mainz');
    })}

module.exports = { minerStop , minerStart , guardianStop , guardianStart }      