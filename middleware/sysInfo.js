//get system info
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const mapSI = new Map();

const sysInfo = async () => {

  function taskGpu () {
    let gpu = shell.exec('glxinfo -B | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', {silent:true}).stdout.slice(0,20);
    gpu = (gpu.search("\n") >= 0 ) ? gpu.slice(0,(gpu.length - 1)) : gpu;
    mapSI.set('gpu', gpu);
    taskRemain();
  }
  function taskRemain () {
    let temp = shell.exec('sensors | grep "edge" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout;
    temp = (temp.search("\n") >= 0 ) ? temp.slice(0,(temp.length - 1)) : temp;
    mapSI.set('temp', temp);
    let watt = shell.exec('sensors | grep "PPT" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout
    watt = (watt.search("\n") >= 0 ) ? watt.slice(0,(watt.length - 1)) : watt;
    mapSI.set('watt', watt);
    mapSI.set('cpu', os.cpus()[0].model);
    mapSI.set('load', os.loadavg());
  }
  try {
    taskGpu ();
    fsPromises.writeFile(path.join(__dirname, '..' , 'data' , 'infoS.json'), JSON.stringify(Object.fromEntries(mapSI), null, 2));
} catch (err) {
    console.error(err);
  }
}

module.exports = { sysInfo }