const minersDB = {
  users: require('../../data/miners.json'),
  setUsers: function (data) { this.users = data }
}

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const deleteOFP = require('./deleteOFP');
const inject = require('./inject');


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
  const wDir = flMiner.wdir;
  const mPath = flMiner.mpath;
  let apiPort = flMiner.apiPort;
const newMiner = { "miner": minerNb, "software": softWare, "wdir": wDir, "mpath": mPath, "pool": pool, "port": port, "tls": tls, "wallet": wallet, "rigName": rigname, "pass": password, "apiPort": apiPort, "description": description};
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
  await inject.injectOFP(lastMiner,C);  
  res.status(200).redirect('/main');              
  }

//Cancel
const minerCancel = async (req, res) => {
  const lastMiner = minersDB.users.length;
  await deleteOFP(lastMiner);  
  res.redirect('/main');              
  }

//Miner software get  
  const minerSoftGet = async (req, res) => {
    const toShowQuery = req.query.toshow;
    const lastMiner = minersDB.users.length;
    const toShow = ((toShowQuery <= 0) || (toShowQuery > lastMiner)) ? lastMiner : toShowQuery;
    const foundMiner = minersDB.users.find(person => person.miner == toShow);
    res.render("msoftware", { title: "Mining Software", 
                          software: foundMiner.software,
                          wdir: foundMiner.wdir,
                          mpath: foundMiner.mpath,
                          last: lastMiner,
                          shown: toShow
                        });
      }
//Mining Software Post modification
const minerSoftPost = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const flMiner = minersDB.users.find(person => person.miner === lastMiner)
  const { wdir, mpath } = req.body; 
  //const tls = (tlsswt == 'on') ? "true" : "false";
//change at least one value
if ((wdir == flMiner.wdir) && (mpath == flMiner.mpath)) return res.status(401).render('msoftware', { title: "Mining Software", software: flMiner.software, wdir: flMiner.wdir, mpath: flMiner.mpath, shown: lastMiner , message: "modify at least one value"});
//verify working directory
if (!fs.existsSync(wdir)) return res.status(401).render('msoftware', { title: "Mining Software", software: flMiner.software, wdir: flMiner.wdir, mpath: flMiner.mpath, shown: lastMiner , message: "doesn't point to existing working directory"});
//verif executable file exist
if (!fs.existsSync(mpath)) return res.status(401).render('msoftware', { title: "Mining Software", software: flMiner.software, wdir: flMiner.wdir, mpath: flMiner.mpath, shown: lastMiner , message: "doesn't point to existing executable"});
//Recognize software
const softWare = (mpath.search("SRB") > 0) ? "SRBMiner-Multi" : (mpath.search("xmr-stak") > 0) ? "XmrStak" : (mpath.search("CryptoDredge") > 0) ? "CryptoDredge" : "unKnown";      
if ( softWare == "unKnown" ) return res.status(401).render('msoftware', { title: "Mining Software", software: flMiner.software, wdir: flMiner.wdir, mpath: flMiner.mpath, shown: lastMiner , message: "unKnown software"});
//create the new flight sheet and inject in miner.json    
  try{
  const minerNb = lastMiner +1;
  //now let's extract info from this new path
  const { reverser, afterUntil, backWard, inBetween, inBetweenLong, startWithLong, beforeUntil } = require('./tools.js');
if (softWare == "SRBMiner-Multi") {
  const dataM = await fsPromises.readFile(mpath, 'utf8');
  let pool = afterUntil(dataM, "-pool ",":");
  let poolPort = inBetweenLong(dataM, `${pool}:`, 4);
  let tls = (dataM.search("-tls ") > 0) ? afterUntil(dataM, "-tls "," ") : "false";
  let wallet = startWithLong(dataM, "ccx7", 94);
  let rigName = (inBetweenLong(dataM, wallet, 1) == ".") ? afterUntil(dataM, (wallet + "."), " ") : (dataM.search("rig-name ") > 0) ? afterUntil(dataM, "-rig-name ", ("/n" || " ")) : "";
  let pass = (dataM.search("-p ") > 0) ? afterUntil(dataM, "-p "," ") : "";
  
  //inject in miner.json    

  const newMiner = { "miner": minerNb, "software": softWare, "wdir": wdir, "mpath": mpath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": 21550, "description": ""};
  minersDB.setUsers([...minersDB.users, newMiner])
  await fsPromises.writeFile(
  path.join(__dirname, '..', '..', 'data', 'miners.json'),
  JSON.stringify(minersDB.users)
  )
      } else {                   
      if (softWare == "XmrStak") { 
          //let mxPath = beforeUntil(mPath, "/");
          const dataM = await fsPromises.readFile(`${wdir}pools.txt`, 'utf8');
          let pool = afterUntil(dataM, '{"pool_address" : "', ':');
          let poolPort = inBetweenLong(dataM, `${pool}:`, 4);
          let tls = (dataM.search('use_tls" : ') > 0) ? (inBetweenLong(dataM, ('use_tls" : ') , 1) == "f") ? "false" : "true" : "false";
          let wallet = startWithLong(dataM, "ccx7", 94);
          let rigName = (inBetweenLong(dataM, wallet, 1) == ".") ? afterUntil(dataM, (wallet + "."), '"') : (dataM.search('rig_id" : "') > 0) ? afterUntil(dataM, 'rig_id" : "' , '"') : "";
          let pass = afterUntil(dataM, 'pool_password" : "' , '"');
          const dataMC = await fsPromises.readFile(`${wdir}config.txt`, 'utf8');
          let apiPort = (!afterUntil(dataMC, 'httpd_port" : ', ",") == "") ? afterUntil(dataMC, 'httpd_port" : ', ",") : "3500/noapi";
                                
              //inject in miner.json           
              const newMiner = { "miner": minerNb, "software": softWare, "wdir": wdir, "mpath": mpath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": apiPort, "description": ""};
              minersDB.setUsers([...minersDB.users, newMiner])
              await fsPromises.writeFile(
              path.join(__dirname, '..', '..', 'data', 'miners.json'),
              JSON.stringify(minersDB.users)
              )

      } else {                   
      if (softWare == "CryptoDredge") { 
              const dataM = await fsPromises.readFile(mPath, 'utf8');
              let pool = afterUntil(dataM, "://", ":");
              let poolPort = inBetweenLong(dataM, `${pool}:`, 4);
              let tls = (dataM.search('ssl') > 0) ? "true" : "false";
              let wallet = startWithLong(dataM, "ccx7", 94);
              let rigName = (inBetweenLong(dataM, wallet, 1) == ".") ? afterUntil(dataM, (wallet + "."), " ") : (dataM.search("-w ") > 0) ? afterUntil(dataM, "-w "," ") : "";
              let pass = (dataM.search("-p ") > 0) ? afterUntil(dataM, "-p "," ") : "";
              let apiPort = (dataM.search("-b ") > 0) ? ((afterUntil(dataM, "-b ", " ")).length > 5) ? afterUntil(dataM, "-b ", "\n") : afterUntil(dataM, "-b ", " ") : "4068";
              

                                //inject in miner.json    
                        
                                const newMiner = { "miner": minerNb, "software": softWare, "wdir": wdir, "mpath": mpath, "pool": pool, "port": poolPort, "tls": tls, "wallet": wallet, "rigName": rigName, "pass": pass, "apiPort": apiPort, "description": ""};
                                minersDB.setUsers([...minersDB.users, newMiner])
                                await fsPromises.writeFile(
                                path.join(__dirname, '..', '..', 'data', 'miners.json'),
                                JSON.stringify(minersDB.users)
                                )
                    } else {
                        console.log("no known software");
                    }
                  }
      }  
res.status(201).redirect('/msoftwarec');
    
  } catch (err) {
    console.error(err);
  }
}
// Route do msoftwarec
const confirmSoftGet = (req, res) => {
  const lastMiner = minersDB.users.length;
  const createdMiner = minersDB.users.find(person => person.miner === lastMiner);
  res.render('msoftwarec', { title: "Confirm ?", 
                            software: createdMiner.software,
                            wdir: createdMiner.wdir,
                            mpath: createdMiner.mpath
                          })

}
//Cancel
const minerSoftCancel = async (req, res) => {
  const lastMiner = minersDB.users.length;
  await deleteOFP(lastMiner);  
  res.redirect('/main');              
  }

  //Inject last mining software(which is the one just created)
const minerSoftInject = async (req, res) => {
  const lastMiner = minersDB.users.length;
  const { cleanswt } = req.body;
  let C = (cleanswt == 'on') ? true : false;
  await inject.injectSoft(lastMiner,C);  
  res.status(200).redirect('/main');              
  }



module.exports = { minerGet , modifyPost , minerCancel, confirmGet , minerInject , minerSoftGet , minerSoftPost , confirmSoftGet , minerSoftCancel , minerSoftInject };        