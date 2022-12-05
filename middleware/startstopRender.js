//Post to start or stop and prepare redirect
const sys = require('sysctlx');
const Promise = require('bluebird');


//Miner Deactivation
const minerStop = (req, res) => {
        const minerStoppingP = sys.stop('ccx-mining');  
        minerStoppingP.then((stop) => {
        console.log('stopping Miner');
        console.log(stop);
        res.status(200).redirect('/main');
    })}

//Miner Activation
const minerStart = (req, res) => {
    const minerStartingP = sys.start('ccx-mining');
    minerStartingP.then((start) => {
    console.log('starting miner');
    console.log(start);
    res.status(200).redirect('/main');
    })}


//Guardian Node Deactivation
const guardianStop = (req, res) => {
        const guardianStoppingP = sys.stop('ccx-guardian');  
        guardianStoppingP.then((stop) => {
        console.log('stopping guardian node');
        console.log(stop);
        res.status(200).redirect('/main');
    })}

//Guardian Node Deactivation
const guardianStart = (req, res) => {
    const guardianStartingP = sys.start('ccx-guardian');
    guardianStartingP.then((start) => {
    console.log('starting guardian node');
    console.log(start);
    res.status(200).redirect('/main');
    })}

module.exports = { minerStop , minerStart , guardianStop , guardianStart }      