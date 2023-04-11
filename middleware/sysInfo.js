//get system info
const os = require('os');
const shell = require('shelljs');

//const { exec } = require('child_process');

const mapSI = new Map();

const sysInfo = () => {

        try {
            mapSI.set('gpu', JSON.parse(JSON.stringify(shell.exec('glxinfo -B | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', {silent:true}).stdout)).slice(0,20));
            mapSI.set('temp', shell.exec('sensors | grep "edge" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout);
            mapSI.set('watt', shell.exec('sensors | grep "PPT" | tr -s " " | cut -d " " -f 2', {silent:true}).stdout);
            mapSI.set('cpu', os.cpus()[0].model);
            mapSI.set('load', os.loadavg());
} catch (err) {
    console.error(err);
}

/* Child process experimental... to solve issue with gpu name not showing when launch with systemctl
    exec('glxinfo -B | grep "Device" | tr -s " " | cut -d " " -f 3,4,5,6', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }   
        //deal with stdout here        
      });
 */
   }

module.exports = { mapSI , sysInfo }