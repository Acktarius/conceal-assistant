
const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
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
            dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);
            dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
            dataMnew = dataMnew.replace(`rig-name ${previousMiner.rigName}`, `rig-name ${createdMiner.rigName}`);

            await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

        } else {
            if (createdMiner.software == "XmrStak") {
                const dataM = await fsPromises.readFile(`${previousMiner.mpath}pools.txt`, 'utf8');
                let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
                dataMnew = dataMnew.replace(previousMiner.pool, createdMiner.pool);
                dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                dataMnew = dataMnew.replace(`"pool_password" : "${previousMiner.pass}`, `"pool_password" : "${createdMiner.pass}`);
                dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
                dataMnew = dataMnew.replace(`"rig_id" : "${previousMiner.rigName}`, `"rig_id" : "${createdMiner.rigName}`);

                await fsPromises.writeFile(`${createdMiner.mpath}pools.txt`, dataMnew, 'utf8');
                
            } else {
                if (createdMiner.software == "CryptoDredge") {
                    const dataM = await fsPromises.readFile(previousMiner.mpath, 'utf8');
                    let dataMnew = dataM.replace(previousMiner.wallet, createdMiner.wallet);
                    dataMnew = dataMnew.replace(previousMiner.pool, createdMiner.pool);
                    dataMnew = dataMnew.replace(previousMiner.port, createdMiner.port);
                    dataMnew = dataMnew.replace(`-p ${previousMiner.pass}`, `-p ${createdMiner.pass}`);
                    dataMnew = dataMnew.replace(`.${previousMiner.rigName}`, `.${createdMiner.rigName}`);
                    dataMnew = dataMnew.replace(`-w ${previousMiner.rigName}`, `-w ${createdMiner.rigName}`);

                    await fsPromises.writeFile(createdMiner.mpath, dataMnew, 'utf8');

                } else {
                    console.log("no known miner");
                }
            }
        }
        //clean up, keep only the last 2 ofp
        if ( C == true ) {
        if (N > 2) {
            for(let z = 1; z < N - 1; z++) {
                await deleteOFP(N-1-z);
            }
        }
    }


        await logEvents(`Operating Flight Sheet for ${createdMiner.software} has been modified`);
    } catch (err) {
        console.error(err);    
    }
}
}

module.exports = injectOFP;
