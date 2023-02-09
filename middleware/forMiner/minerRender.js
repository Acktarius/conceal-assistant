const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const deleteOFP = require('./deleteOFP');

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
  
      
const modifyPost = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const flMiner = minersDB.users.find(person => person.miner === lastMiner)
  const { wallet, pool, port, rigname, password } = req.body; 
//change at least one value
  if ((wallet == flMiner.wallet) && (pool == flMiner.pool) && (port== flMiner.port) && (rigname == flMiner.rigName) && (password == flMiner.pass)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "modify at least one value"});
//wallet check
  if ((wallet.length !== 98 || !(wallet.startsWith("ccx7")))) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "wallet address not valid"});
//verif port as a number
  if (isNaN(port)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "port can't be a string"});
      
//create the new flight sheet and inject in miner.json    
  try{
  const minerNb = lastMiner +1;
  const softWare = flMiner.software;
  const mPath = flMiner.mPath;
const newMiner = { "miner": minerNb, "software": softWare, "mpath": mPath, "pool": pool, "port": port, "wallet": wallet, "rigName": rigname, "pass": password, "apiPort": port};
minersDB.setUsers([...minersDB.users, newMiner])
await fsPromises.writeFile(
path.join(__dirname, '..', '..', 'data', 'miners.json'),
JSON.stringify(minersDB.users)
)
const createdMiner = minersDB.users.find(person => person.miner === minerNb)
  
    res.render("msettingsc", { title: "Confirm Settings", 
                            software: createdMiner.software,
                            pool: createdMiner.pool,
                            port: createdMiner.port,
                            wallet: createdMiner.wallet,
                            rigname: createdMiner.rigName,
                            password: createdMiner.pass
                          });
  } catch (err) {
    console.error(err);
  }
}

const minerCancel = async (req, res) => {
  const lastMiner = minersDB.users.length;
  await deleteOFP(lastMiner);  
  res.redirect('/main');              
  }
  
  

module.exports = { minerGet , modifyPost , minerCancel };        