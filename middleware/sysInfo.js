//get system info
const os = require('os');
const shell = require('shelljs');

const infoCpu = os.cpus()[0].model;
var infoLoad = os.loadavg();

var infoGpu = shell.exec('glxinfo | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', {silent:true}).stdout;
infoGpu = ( infoGpu.length > 20 ) ? infoGpu.slice(0,20) : infoGpu;

var tempGpu = shell.exec('sensors | grep "edge" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout;
tempGpu = ( tempGpu.length > 7 ) ? tempGpu.slice(0,7) : tempGpu;

var wattGpu = shell.exec('sensors | grep "PPT" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout;
wattGpu = ( wattGpu.length > 5 ) ? wattGpu.slice(0,5) : wattGpu;


module.exports = { infoCpu , infoLoad , infoGpu, tempGpu, wattGpu };