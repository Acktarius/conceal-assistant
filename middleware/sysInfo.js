//get system info
const os = require('os');
const shell = require('shelljs');
const exec = require('shelljs.exec');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { osN } = require('./checkOs.js');

const mapSI = new Map();





const sysInfo = async (req, res, next) => {

  function taskGpu () {
    const gpuModel = () => {
    if (osN() == 'linux') {
    let gpu = shell.exec('glxinfo -B | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6; exit', {silent:true}).stdout.slice(0,20);
    gpu = (gpu.search("\n") >= 0 ) ? gpu.slice(0,(gpu.length - 1)) : gpu;
    return gpu;
    } else if (osN() == 'win') {
      let gpu = exec("powershell.exe (Get-WmiObject Win32_VideoController).Name; exit", {silent:true}).stdout.slice(0,30);
      gpu = (gpu.search("\n") >= 0 ) ? gpu.slice(0,(gpu.length - 1)) : gpu;
      return gpu;
    }
  }
    mapSI.set('gpu', gpuModel());
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
    fsPromises.writeFile(path.join(__dirname, '..' , 'data' , 'infoSys.json'), JSON.stringify(Object.fromEntries(mapSI), null, 2));
    return next();
} catch (err) {
    console.error(err);
  }
}

module.exports = { sysInfo }