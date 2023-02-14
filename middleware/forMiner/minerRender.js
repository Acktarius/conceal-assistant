const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const deleteOFP = require('./deleteOFP');
const injectOFP = require('./injectOFP');


const minerGet = async (req, res) => {
  const toShowQuery = req.query.toshow;
  const lastMiner = minersDB.users.length;
  const toShow = ((toShowQuery <= 0) || (toShowQuery > lastMiner)) ? lastMiner : toShowQuery;
  const foundMiner = minersDB.users.find(person => person.miner == toShow);
  res.render("msettings", { title: "Miner Settings", 
                        software: foundMiner.software,
                        pool: foundMiner.pool,
                        port: foundMiner.port,
                        tls: foundMiner.tls,
                        wallet: foundMiner.wallet,
                        rigname: foundMiner.rigName,
                        password: foundMiner.pass,
                        description: foundMiner.description,
                        last: lastMiner,
                        shown: toShow
                      });
    }

const modifyPost = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const flMiner = minersDB.users.find(person => person.miner === lastMiner)
  const { wallet, pool, port, tlsswt, rigname, password, description } = req.body; 
  const tls = (tlsswt == 'on') ? "true" : "false";
//change at least one value
  if ((wallet == flMiner.wallet) && (pool == flMiner.pool) && (port== flMiner.port) && (tls == flMiner.tls) && (rigname == flMiner.rigName) && (password == flMiner.pass) && (description == flMiner.description)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, shown: lastMiner , message: "modify at least one value"});
//wallet check
  if ((wallet.length !== 98 || !(wallet.startsWith("ccx7")))) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, shown: lastMiner , message: "wallet address not valid"});
//verif port as a number
  if (isNaN(port)) return res.status(401).render('msettings', { title: "Miner Settings", software: flMiner.software, pool: flMiner.pool, port: flMiner.port, wallet: flMiner.wallet, rigname: flMiner.rigName, password: flMiner.pass, shown: lastMiner , message: "port can't be a string"});
      
//create the new flight sheet and inject in miner.json    
  try{
  const minerNb = lastMiner +1;
  const softWare = flMiner.software;
  const mPath = flMiner.mpath;
  let apiPort = flMiner.apiPort;
const newMiner = { "miner": minerNb, "software": softWare, "mpath": mPath, "pool": pool, "port": port, "tls": tls, "wallet": wallet, "rigName": rigname, "pass": password, "apiPort": apiPort, "description": description};
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
                            tls: createdMiner.tls,
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