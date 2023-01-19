const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const extractInfo = async () => {
    if (!fs.existsSync('/etc/systemd/system/ccx-mining.service')) {
        console.log("file doesn't exist");
        } else {
        try {
            const data = await fsPromises.readFile('/etc/systemd/system/ccx-mining.service', 'utf8');
                let begin = data.search("ExecStart=");
                let end = data.search(".sh");
                if (!begin || !end) {
                    console.log("can't find path");
                } else {
                const { reverser, afterUntil, backWard, inBetween, inBetweenLong, startWithLong } = require('./tools.js');
                let minerNb = minersDB.users.length +1;
                let mPath = data.slice(begin+10,end+3);
                let softWare = (data.search("SRB") > 0) ? "SRBMiner-MULTI" : (data.search("xmr-stak") > 0) ? "XmrStak" : "unknown";
                let executable = reverser(backWard(data,".sh","/"));
                //now let's look at the miner
                const dataM = await fsPromises.readFile(mPath, 'utf8');
                let pool = inBetween(dataM, "-pool ",":");
                let poolPort = inBetweenLong(dataM, ":", 4);
                let wallet = startWithLong(dataM, "ccx7", 94);
                let rigName = (inBetweenLong(dataM, wallet, 1) == ".") ? afterUntil(dataM, (wallet + "."), " ") : "";
                let pass = (dataM.search("-p ") > 0) ? afterUntil(dataM, "-p "," ") : "";
                //inject in miner.json    
                const newMiner = { "miner": minerNb, "software":softWare, "mpath": mPath, "executable": executable, 
                "pool":pool, "port":poolPort, "wallet":wallet, "rigName":rigName, "pass":pass}
                minersDB.setUsers([...minersDB.users, newMiner])
                await fsPromises.writeFile(
                    path.join(__dirname, '..', '..', 'data', 'miners.json'),
                    JSON.stringify(minersDB.users)
                )
                }
            } catch (err) {
            console.error(err);
            }         
        }
  }


module.exports = { extractInfo };
