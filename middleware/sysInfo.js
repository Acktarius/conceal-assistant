//get system info
const os = require('os');
const shell = require('shelljs');

const mapSI = new Map();
try {
mapSI.set('gpu', shell.exec('glxinfo | head -n 60 | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', {silent:true, shell:'/bin/bash'}).stdout);
mapSI.set('temp', shell.exec('sensors | grep "edge" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout);
mapSI.set('watt', shell.exec('sensors | grep "PPT" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout);
mapSI.set('cpu', os.cpus()[0].model);
mapSI.set('load', os.loadavg());
} catch (err) {
    console.error(err);
}
module.exports = { mapSI }