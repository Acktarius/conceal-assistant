const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const winsc = require('winsc');
const { logEvents } = require('../logEvents');
const deleteOFP = require('./deleteOFP');
const { da } = require('date-fns/locale');
const { smName , osN } = require('../checkOs.js');
const { reverser, afterUntil, backWard, inBetween, inBetweenLong, startWithLong, beforeUntil } = require('./tools.js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Helper function to reload systemd service
const reloadSystemdService = async (serviceName) => {
  try {
    await execPromise('systemctl daemon-reload');
    await execPromise(`systemctl restart ${serviceName}`);
    return 'success';
  } catch (error) {
    console.error('Failed to reload service:', error.message);
    return 'failed';
  }
};

const injectOFP = async (N,C) => {  
const previousMiner = minersDB.users.find(person => person.miner === N-1);
const createdMiner = minersDB.users.find(person => person.miner === N);
if (createdMiner.mpath != previousMiner.mpath) {
    console.log("miner path not matching");
    } else {
    try {
        if (createdMiner.software == "SRBMiner-Multi") {
            const dataM = await fsPromises.readFile(previousMiner.mpath, 'utf8');
            // let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
            let dataMnew = dataM.replace(previousMiner.pool, createdMiner.pool);
            dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
            dataMnew = dataMnew.replace(`--tls ${previousMiner.tls}`, `--tls ${createdMiner.tls}`);
            dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);
            dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
            
            if (inBetweenLong(dataMnew, previousMiner.wallet, 1) == "." || inBetweenLong(dataMnew, previousMiner.wallet, 1) == "@") {
                if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                    dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, `${createdMiner.wallet}${createdMiner.rigName}`);
                    dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName.substring(1)}`, `rig-name ${createdMiner.rigName.substring(1)}`);
                }    else {
                dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, createdMiner.wallet)
                dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName.substring(1)}`, `rig-name ${createdMiner.rigName}`);
                }
            } else {
                if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                    dataMnew = dataMnew.replace(previousMiner.wallet, `${createdMiner.wallet}${createdMiner.rigName}`);
                    dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName}`, `rig-name ${createdMiner.rigName.substring(1)}`);
                }    else {
                dataMnew = dataMnew.replace(previousMiner.wallet, createdMiner.wallet)
                dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName}`, `rig-name ${createdMiner.rigName}`);
                }
            }
            
            await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

        } else if (createdMiner.software == "XmrStak") {
                const dataM = await fsPromises.readFile(`${previousMiner.wdir}pools.txt`, 'utf8');
                let dataMnew = dataM.replace(previousMiner.pool, createdMiner.pool);
                dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                dataMnew = dataMnew.replace(`"pool_password" : "${previousMiner.pass}`, `"pool_password" : "${createdMiner.pass}`);
                dataMnew = dataMnew.replace(`use_tls" : ${previousMiner.tls}`, `use_tls" : ${createdMiner.tls}`);
                
                if ((inBetweenLong(dataMnew, previousMiner.wallet, 1) == ".") || (inBetweenLong(dataMnew, previousMiner.wallet, 1) == "@")) {
                    if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                        dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, `${createdMiner.wallet}${createdMiner.rigName}`);
                        dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName.substring(1)}`, `"rig_id" : "${createdMiner.rigName.substring(1)}`);
                    }    else {
                    dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, createdMiner.wallet)
                    dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName.substring(1)}`, `"rig_id" : "${createdMiner.rigName}`);
                    }
                } else {
                    if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                        dataMnew = dataMnew.replace(previousMiner.wallet, `${createdMiner.wallet}${createdMiner.rigName}`);
                        dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName}`, `"rig_id" : "${createdMiner.rigName.substring(1)}`);
                    }    else {
                    dataMnew = dataMnew.replace(previousMiner.wallet, createdMiner.wallet)
                    dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName}`, `"rig_id" : "${createdMiner.rigName}`);
                    }
                }

                await fsPromises.writeFile(`${createdMiner.wdir}pools.txt`, dataMnew, 'utf8');
                
            } else if (createdMiner.software == "CryptoDredge") {
                    const dataM = await fsPromises.readFile(previousMiner.mpath, 'utf8');
                    let dataMnew = dataM.replace(previousMiner.pool, createdMiner.pool);
                    dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                    if ((previousMiner.tls == "false") && (createdMiner.tls == "true")) dataMnew = dataMnew.replace("tcp://", "ssl://");
                    if ((previousMiner.tls == "true") && (createdMiner.tls == "false")) dataMnew = dataMnew.replace("ssl://", "tcp://");
                    dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);

                    if (inBetweenLong(dataMnew, previousMiner.wallet, 1) == "." || inBetweenLong(dataMnew, previousMiner.wallet, 1) == "@") {
                        if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                            dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, `${createdMiner.wallet}${createdMiner.rigName}`);
                            dataMnew = dataMnew.replace(`-w ${previousMiner.rigName.substring(1)}`, `-w ${createdMiner.rigName.substring(1)}`);
                        }    else {
                        dataMnew = dataMnew.replace(`${previousMiner.wallet}${previousMiner.rigName}`, createdMiner.wallet)
                        dataMnew = dataMnew.replace(`-w ${previousMiner.rigName.substring(1)}`, `-w ${createdMiner.rigName}`);
                        }
                    } else {
                        if ((createdMiner.rigName.charAt(0) == "." ) || (createdMiner.rigName.charAt(0) == "@")) {
                            dataMnew = dataMnew.replace(previousMiner.wallet, `${createdMiner.wallet}${createdMiner.rigName}`);
                            dataMnew = dataMnew.replace(`-w ${previousMiner.rigName}`, `-w ${createdMiner.rigName.substring(1)}`);
                        }    else {
                        dataMnew = dataMnew.replace(previousMiner.wallet, createdMiner.wallet);
                        dataMnew = dataMnew.replace(`-w ${previousMiner.rigName}`, `-w ${createdMiner.rigName}`);
                        }
                    }

                    await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

                } else {
                    console.log("no known miner");
                }
            
        
        //clean up: keeps only the last 2 ofp and the first 3 template
        if ( C == true ) {
            if (N > 5) {
                for(let z = 1; z < N - 4; z++) {
                    await deleteOFP(N-1-z);
                }
            }
        }


        await logEvents(`Operating Flight Sheet for ${createdMiner.software} has been modified; ${createdMiner.description}`);
    } catch (err) {
        console.error(err);    
    }
}
}


// modify mining Service
const injectSoft = async (N,C) => {  
    const previousMiner = minersDB.users.find(person => person.miner === N-1);
    const createdMiner = minersDB.users.find(person => person.miner === N);
    if (createdMiner.wdir == previousMiner.wdir) {
        console.log(`software is the same new:${createdMiner.wdir} old:${previousMiner.wdir} `);
        await deleteOFP(N);
    } else {
        try {
            let dataLS = await fsPromises.readFile(`/etc/systemd/system/${smName(osN())}.service`, 'utf8');
            
            let dataLSnew = dataLS.replace(previousMiner.wdir, createdMiner.wdir);
            dataLSnew = dataLSnew.replace(previousMiner.mpath, createdMiner.mpath);
            
            await fsPromises.writeFile(`/etc/systemd/system/${smName(osN())}.service`, dataLSnew, 'utf8');
            
            await reloadSystemdService(smName(osN()));
            await logEvents(`${createdMiner.software} is now in service`);

            //clean up: keeps only the last 2 ofp and the 2 first template
            if ( C == true ) {
                if (N > 4) {
                    for(let z = 1; z < N - 3; z++) {
                        await deleteOFP(N-1-z);
                    }
                }
            }
            
        } catch (err) {
            console.error(err);    
        }
    }
}


module.exports = { injectOFP , injectSoft };
