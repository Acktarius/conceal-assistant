//get system info
const { Promise } = require('bluebird');
const { rmSync } = require('fs');
const os = require('os');
const shell = require('shelljs');


const infoCpu = os.cpus()[0].model;
var infoLoad = os.loadavg();

var gpuM = shell.exec('glxinfo | head -n 60 | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', {silent:true}).stdout;

var tempGpu = shell.exec('sensors | grep "edge" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout;

var wattGpu = shell.exec('sensors | grep "PPT" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout;

Promise.allSettled([gpuM, tempGpu, wattGpu]).then((results) => {
    let gpuM = results[0];
    gpuM = ( gpuM.length > 20 ) ? gpuM.slice(0,20) : gpuM;
    let tempGpu = results[1];
    tempGpu = ( tempGpu.length > 7 ) ? tempGpu.slice(0,7) : tempGpu;
    let wattGpu = results[2];
    wattGpu = ( wattGpu.length > 5 ) ? wattGpu.slice(0,5) : wattGpu;
})



module.exports = { infoCpu , infoLoad , gpuM , tempGpu, wattGpu };
