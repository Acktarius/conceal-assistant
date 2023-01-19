const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const minerGet = (req, res) => {
  const lastMiner = minersDB.users.length;
  if (!lastMiner > 0) return res.status(400).json({ 'message': 'No Operating Flight Plan'})
  const foundMiner = minersDB.users.find(person => person.miner === lastMiner)
  
    res.render("msettings", { title: "Miner Settings", 
                            software: foundMiner.software,
                            pool: foundMiner.pool,
                            port: foundMiner.port,
                            wallet: foundMiner.wallet,
                            rigname: foundMiner.rigName,
                            password: foundMiner.pass
                          });   
            
        }
  

module.exports = { minerGet };        