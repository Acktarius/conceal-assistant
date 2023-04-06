const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

  const fs = require('fs');
  const fsPromises = require('fs').promises;
  const path = require('path');
const deleteOFP = require('./deleteOFP');


const remover = async () => {  
const lastMiner = minersDB.users.length;
if (lastMiner > 4 ) {
const flMiner = minersDB.users.find(person => person.miner === lastMiner)
const fpMiner = minersDB.users.find(person => person.miner === lastMiner - 1)

if ((flMiner.software == fpMiner.software) && (flMiner.mpath == fpMiner.mpath) && (flMiner.pool == fpMiner.pool) && (flMiner.port == fpMiner.port) && (flMiner.wallet == fpMiner.wallet) && (flMiner.rigName == fpMiner.rigName) && (flMiner.pass == fpMiner.pass) && (flMiner.apiPort == fpMiner.apiPort)) {
     console.log("duplicate miner flight sheet will be removed !");
     deleteOFP(lastMiner);                 
     }
}
}
module.exports = { remover };