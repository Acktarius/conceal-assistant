
const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const sys = require('sysctlx');
const logEvents = require('../logEvents');
const deleteOFP = require('./deleteOFP');

const injectOFP = async (N,C) => {  
const previousMiner = minersDB.users.find(person => person.miner === N-1);
const createdMiner = minersDB.users.find(person => person.miner === N);
if (createdMiner.mpath != previousMiner.mpath) {
    console.log("miner path not matching");
    } else {
    try {
        if (createdMiner.software == "SRBMiner-Multi") {
            const dataM = await fsPromises.readFile(previousMiner.mpath, 'utf8');
            let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
            dataMnew = dataMnew.replace(previousMiner.pool, createdMiner.pool);
            dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
            dataMnew = dataMnew.replace(`--tls ${previousMiner.tls}`, `--tls ${createdMiner.tls}`);
            dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);
            dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
            dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName}`, `rig-name ${createdMiner.rigName}`);

            await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

        } else {
            if (createdMiner.software == "XmrStak") {
                const dataM = await fsPromises.readFile(`${previousMiner.wdir}pools.txt`, 'utf8');
                let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
                dataMnew = dataMnew.replace(previousMiner.pool, createdMiner.pool);
                dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                dataMnew = dataMnew.replace(`"pool_password" : "${previousMiner.pass}`, `"pool_password" : "${createdMiner.pass}`);
                dataMnew = dataMnew.replace(`use_tls" : ${previousMiner.tls}`, `use_tls" : ${createdMiner.tls}`);
                dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
                dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName}`, `"rig_id" : "${createdMiner.rigName}`);

                await fsPromises.writeFile(`${createdMiner.wdir}pools.txt`, dataMnew, 'utf8');
                
            } else {
                if (createdMiner.software == "CryptoDredge") {
                    const dataM = await fsPromises.readFile(previousMiner.mpath, 'utf8');
                    let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
                    dataMnew = dataMnew.replace(previousMiner.pool, createdMiner.pool);
                    dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                    if ((previousMiner.tls == "false") && (createdMiner.tls == "true")) dataMnew = dataMnew.replace("tcp://", "ssl://");
                    if ((previousMiner.tls == "true") && (createdMiner.tls == "false")) dataMnew = dataMnew.replace("ssl://", "tcp://");
                    dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);
                    dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
                    dataMnew = dataMnew.replace(`-w ${previousMiner.rigName}`, `-w ${createdMiner.rigName}`);

                    await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

                } else {
                    console.log("no known miner");
                }
            }
        }
        //clean up: keeps only the last 2 ofp and the first 2 template
        if ( C == true ) {
            if (N > 4) {
                for(let z = 1; z < N - 3; z++) {
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
    if (createdMiner.mpath == previousMiner.mpath) {
        console.log(`software is the same new:${createdMiner.mpath} old:${previousMiner.mpath} `);
        await deleteOFP(N);
        } else {
        try {
            //await fsPromises.chmod("/etc/systemd/system/ccx-mining.service", 666 );
            const dataS = await fsPromises.readFile("/etc/systemd/system/ccx-mining.service", 'utf8');
            
            let dataSnew = dataS.replace(previousMiner.wdir, createdMiner.wdir);
            dataSnew = dataSnew.replace(previousMiner.mpath, createdMiner.mpath);
            
            await fsPromises.writeFile("/etc/systemd/system/ccx-mining.service", dataSnew, 'utf8');
            
            sys.reload('ccx-mining');
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
