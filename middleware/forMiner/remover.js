const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

  const fs = require('fs');
  const fsPromises = require('fs').promises;
  const path = require('path');

const remover = async () => {  
const lastMiner = minersDB.users.length;
console.log(lastMiner);
if (lastMiner >= 2 ) {
const foundLastMiner = minersDB.users.find(person => person.miner === lastMiner)
const foundPreviousMiner = minersDB.users.find(person => person.miner === lastMiner - 1)
    if (foundLastMiner.software == foundPreviousMiner.software) {
        if (foundLastMiner.mpath == foundPreviousMiner.mpath) {
            if (foundLastMiner.pool == foundPreviousMiner.pool) {
                if (foundLastMiner.port == foundPreviousMiner.port) {
                    if (foundLastMiner.wallet == foundPreviousMiner.wallet) {
                        if (foundLastMiner.rigName == foundPreviousMiner.rigName) {
                            if (foundLastMiner.pass == foundPreviousMiner.pass) {
                                if (foundLastMiner.apiPort == foundPreviousMiner.apiPort) {
                                    console.log("duplicate miner flight sheet will be removed !");
                                    try {
                                    const previousMiners = minersDB.users.filter(person => person.miner !== lastMiner);
                                    minersDB.setUsers(previousMiners);
                                    await fsPromises.writeFile(
                                        path.join(__dirname, '..', '..' , 'data', 'miners.json'),
                                        JSON.stringify(minersDB.users)
                                        )
                                   } catch (err) {
                                        console.error(err);    
                                   }
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
}


module.exports = { remover };