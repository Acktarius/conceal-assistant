//child process to exec daemon update
const os = require('os');
const shell = require('shelljs');
const path = require('path');
const { execFileSync } = require('child_process');

const daemonUpdate = (ccpath) => { 
  console.log("upgrade Conceal Core");
  shell.chmod(755, path.join(__dirname, '..', 'forNode', 'daemonUpdate.sh'));
  shell.chmod(755, path.join(__dirname, '..', 'forNode', 'displayUpdate.sh'));
const argPath = path.normalize(__dirname, '..', 'forNode');

const options = {
  detached: true,
  encoding: 'utf-8',
  cwd: ccpath,
  stdio: 'inherit',
  timeout: 1000000,
  killSignal: 'SIGTERM',
  shell: false,
};

execFileSync(path.join(__dirname, '..', 'forNode', 'displayUpdate.sh'), [`${argPath}`], options, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }   
      if (stdout) {
        console.log(stdout + "ca fonctionne ?" + process.pid);
      }
  });

}


module.exports = daemonUpdate;