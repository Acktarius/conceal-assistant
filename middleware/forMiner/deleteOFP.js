
const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const deleteOFP = async (N) => {  
const lastMiner = minersDB.users.length;
if (0<= N && N <= lastMiner) {
const fnMiner = minersDB.users.find(person => person.miner === N)

    try {
    const otherMiners = minersDB.users.filter(person => person.miner !== N);
    
    for (let i = 0; i < lastMiner-N; i++) {
      otherMiners[N+i-1].miner = N+i;    
      } 
    minersDB.setUsers(otherMiners);
    
    await fsPromises.writeFile(
        path.join(__dirname, '..', '..' , 'data', 'miners.json'),
        JSON.stringify(minersDB.users)
        )
        
    } catch (err) {
        console.error(err);    
    }
                                
                            
}
}

//let N = 2;
//deleteOFP(N);

module.exports = deleteOFP;