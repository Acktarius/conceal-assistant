const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const deleteOFP = require('./deleteOFP');
const injectOFP = require('./injectOFP');

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
                            password: foundMiner.pass,
                            description: foundMiner.description
                          });   
            
        }
  
      
const modifyPost = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const flMiner = minersDB.users.find(person => person.miner === lastMiner)
  const { wallet, pool, port, rigname, password, description } = req.body; 
//change at least one value
  if ((wallet == flMiner.wallet) && (pool == flMiner.pool) && (port== flMiner.port) && (rigname == flMiner.rigName) && (password == flMiner.pass) && (description == flMiner.description)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, description: flMiner.description, message: "modify at least one value"});
//wallet check
  if ((wallet.length !== 98 || !(wallet.startsWith("ccx7")))) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "wallet address not valid"});
//verif port as a number
  if (isNaN(port)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, message: "port can't be a string"});
      
//create the new flight sheet and inject in miner.json    
  try{
  const minerNb = lastMiner +1;
  const softWare = flMiner.software;
  const mPath = flMiner.mpath;
  let apiPort = flMiner.apiPort;
const newMiner = { "miner": minerNb, "software": softWare, "mpath": mPath, "pool": pool, "port": port, "wallet": wallet, "rigName": rigname, "pass": password, "apiPort": apiPort, "description": description};
minersDB.setUsers([...minersDB.users, newMiner])
await fsPromises.writeFile(
path.join(__dirname, '..', '..', 'data', 'miners.json'),
JSON.stringify(minersDB.users)
)
res.status(201).redirect('/msettingsc');
    
  } catch (err) {
    console.error(err);
  }
}

// Route do msettingsc
const confirmGet = (req, res) => {
  const lastMiner = minersDB.users.length;
  const createdMiner = minersDB.users.find(person => person.miner === lastMiner);
  res.render('msettingsc', { title: "Confirm ?", 
                            software: createdMiner.software,
                            pool: createdMiner.pool,
                            port: createdMiner.port,
                            wallet: createdMiner.wallet,
                            rigname: createdMiner.rigName,
                            password: createdMiner.pass,
                            description: createdMiner.description
                          })

}

//Inject last miner (which is the one just created)
const minerInject = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const { cleanswt } = req.body;
  let C = (cleanswt == 'on') ? true : false;
  await injectOFP(lastMiner,C);  
  res.status(200).redirect('/main');              
  }

//Cancel
const minerCancel = async (req, res) => {
  const lastMiner = minersDB.users.length;
  await deleteOFP(lastMiner);  
  res.redirect('/main');              
  }
  
  

module.exports = { minerGet , modifyPost , minerCancel, confirmGet , minerInject };        