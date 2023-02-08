const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }

    const lastMiner = minersDB.users.length;
   
    const foundMiner = minersDB.users.find(person => person.miner === lastMiner)
    const whichMiner = (lastMiner == 0) ? "unk" : (foundMiner.software == "SRBMiner-Multi" ) ? "srb" : (foundMiner.software == "XmrStak" ) ? "xmr" : (foundMiner.software == "CryptoDredge" ) ? "crd" : "unk";
  

module.exports = { whichMiner };