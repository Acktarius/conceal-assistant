const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { osN } = require('../checkOs.js');
const { afterUntil, startWithLong , inBetweenLong, inBetween, beforeUntil } = require('./tools.js');

const extractInfo = async () => {
    fs.readFile(path.join(__dirname, "../..", "data", "infOSp.json"), 'utf8', async function (err, contents) {
        if (err) {
            console.log("issue reading infOSp.json file");
        } else {
            try {
                const infoM = JSON.parse(contents);
                let mPath = infoM.mPath;
                let wdir = infoM.wDir;
                console.log(mPath);
                let tempmPath = await fsPromises.readFile(mPath, 'utf8');
                let exe = (osN() == "win") ? inBetween(tempmPath , "ble>", "</exe") : `${mPath}`;
                let wDir = (osN() == "win") ? beforeUntil(exe, "\\") : `${wdir}`;
         
                let softWare = (exe.search("SRB") > 0) ? "SRBMiner-Multi" : (exe.search("xmr-stak") > 0) ? "XmrStak" : (exe.search("CryptoDredge") > 0) ? "CryptoDredge" : "unKnown";
                //const minerNb = minersDB.users.length +1;
                //now let's look at the miner
                    if (softWare == "SRBMiner-Multi") {
                const dataM = await fsPromises.readFile(mPath, 'utf8');
                let pool = afterUntil(dataM, "-pool ",":");
                let poolPort = afterUntil(dataM, `${pool}:`, " ");
                let tls = (dataM.search("-tls ") > 0) ? afterUntil(dataM, "-tls "," ") : "false";
                let wallet = startWithLong(dataM, "ccx7", 94);       
                let rigName = ((inBetweenLong(dataM, wallet, 1) == ".") || (inBetweenLong(dataM, wallet, 1) == "@" )) ? afterUntil(dataM, wallet, " ") : (dataM.search("rig-name ") > 0) ? afterUntil(dataM, "-rig-name ", ("/n" || " ")) : "";
                let pass = (dataM.search("-p ") > 0) ? afterUntil(dataM, "-p "," ") : "";
                
                //inject in miner.json    
                const minerNb = minersDB.users.length +1;
                const newMiner = { "miner": minerNb, "software": softWare, "wdir": wDir, "mpath": mPath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": 21550, "description": ""};
                minersDB.setUsers([...minersDB.users, newMiner])
                await fsPromises.writeFile(
                path.join(__dirname, '..', '..', 'data', 'miners.json'),
                JSON.stringify(minersDB.users, null, 2)
                )
                    
                    } else if (softWare == "XmrStak") { 
                        //let mxPath = beforeUntil(mPath, "/");
                        const dataM = await fsPromises.readFile(`${wDir}pools.txt`, 'utf8');
                        let pool = afterUntil(dataM, '{"pool_address" : "', ':');
                        let poolPort = afterUntil(dataM, `${pool}:`, '"');
                        let tls = (dataM.search('use_tls" : ') > 0) ? (inBetweenLong(dataM, ('use_tls" : ') , 1) == "f") ? "false" : "true" : "false";
                        let wallet = startWithLong(dataM, "ccx7", 94);
                        let rigName = ((inBetweenLong(dataM, wallet, 1) == ".") || (inBetweenLong(dataM, wallet, 1) == "@" )) ? afterUntil(dataM, wallet, '"') : (dataM.search('rig_id" : "') > 0) ? afterUntil(dataM, 'rig_id" : "' , '"') : "";
                        let pass = afterUntil(dataM, 'pool_password" : "' , '"');
                        const dataMC = await fsPromises.readFile(`${wDir}config.txt`, 'utf8');
                        let apiPort = (!afterUntil(dataMC, 'httpd_port" : ', ",") == "") ? afterUntil(dataMC, 'httpd_port" : ', ",") : "3500/noapi";
                                              
                            //inject in miner.json
                            const minerNb = minersDB.users.length +1;           
                            const newMiner = { "miner": minerNb, "software": softWare, "wdir": wDir, "mpath": mPath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": apiPort, "description": ""};
                            minersDB.setUsers([...minersDB.users, newMiner])
                            await fsPromises.writeFile(
                            path.join(__dirname, '..', '..', 'data', 'miners.json'),
                            JSON.stringify(minersDB.users, null, 2)
                            )

                    } else if (softWare == "CryptoDredge") { 
                            const dataM = await fsPromises.readFile(mPath, 'utf8');
                            let pool = afterUntil(dataM, "://", ":");
                            let poolPort = afterUntil(dataM, `${pool}:`, " ");
                            let tls = (dataM.search('ssl') > 0) ? "true" : "false";
                            let wallet = startWithLong(dataM, "ccx7", 94);
                            let rigName = ((inBetweenLong(dataM, wallet, 1) == ".") || (inBetweenLong(dataM, wallet, 1) == "@" )) ? afterUntil(dataM, wallet, " ") : (dataM.search("-w ") > 0) ? afterUntil(dataM, "-w "," ") : "";
                            let pass = (dataM.search("-p ") > 0) ? afterUntil(dataM, "-p "," ") : "";
                            let apiPort = (dataM.search("-b ") > 0) ? ((afterUntil(dataM, "-b ", " ")).length > 5) ? afterUntil(dataM, "-b ", "\n") : afterUntil(dataM, "-b ", " ") : "4068";
                            
                                //inject in miner.json    
                                const minerNb = minersDB.users.length +1;
                                const newMiner = { "miner": minerNb, "software": softWare, "wdir": wDir, "mpath": mPath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": apiPort, "description": ""};
                                minersDB.setUsers([...minersDB.users, newMiner])
                                await fsPromises.writeFile(
                                path.join(__dirname, '..', '..', 'data', 'miners.json'),
                                JSON.stringify(minersDB.users, null, 2)
                                )
                    } else {
                        console.log("no known software");
                    }
               
            } catch (err) {
                console.error(err);
            }                  
        }})
        }

module.exports = { extractInfo };
