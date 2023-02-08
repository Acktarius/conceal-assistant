const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

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
  
      
const modifyPost = (req, res) => {
  const lastMiner = minersDB.users.length;
  const flMiner = minersDB.users.find(person => person.miner === lastMiner)
  const { wallet, pool, port, rigname, password } = req.body; 
//change at least one value
  if ((wallet == flMiner.wallet) && (pool == flMiner.pool) && (port== flMiner.port) && (rigname == flMiner.rigName) && (password == flMiner.pass)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "modify at least one value"});
//wallet check
  if ((wallet.length !== 98 || !(wallet.startsWith("ccx7")))) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "wallet address not valid"});

  if (isNaN(port)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "port can't be a string"});
      }


module.exports = { minerGet , modifyPost };        