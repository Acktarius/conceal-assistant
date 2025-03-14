const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
const minersDB = {
    users: require('../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }
require('dotenv').config()

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const pjson = require('pjson');

const { logEvents } = require('../middleware/logEvents');
const { remover } = require('../middleware/forMiner/remover');
const deleteOFP = require('../middleware/forMiner/deleteOFP');
const { sysInfo } = require('../middleware/sysInfo');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    //delete access_token cookie
    if (cookies.access_token) {
        res.clearCookie('access_token', { httpOnly: true });
    }
    
    //delete refreshToken cookie and update users.json
    if (!cookies.jwt) {
        return res.sendStatus(204); // no content to sendback
    } else {
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
   if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    //return res.sendStatus(204);
   } else {
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(usersDB.users)
        );
        if (fs.existsSync(path.join(__dirname, '..', 'data', 'infOSp.json')) == true ) {
        fs.unlink(path.join(__dirname, '..', 'data', 'infOSp.json'), (err) => {
            if (err) {
                res.status(500).send({
                message: "Could not delete infOSp" + err,
                });
            }});    
        };

        if (fs.existsSync(path.join(__dirname, '..', 'data', 'infoSys.json')) == true ) {
        fs.unlink(path.join(__dirname, '..', 'data', 'infoSys.json'), (err) => {
            if (err) {
                res.status(500).send({
                message: "Could not delete infoSys" + err,
                });
            }});
        };    
    await res.clearCookie('jwt', { httpOnly: true });
    remover();
    console.log('logging out');
    res.redirect('index');
        }
    }   
}

const handleDeleteLogout = async (req, res, next) => {
    const cookies = req.cookies;
    //delete access_token cookie
    if (cookies.access_token) {
        res.clearCookie('access_token', { httpOnly: true });
    }
    
    //delete refreshToken cookie and update users.json
    if (!cookies.jwt) return res.sendStatus(204); // no content to sendback
    const refreshToken = cookies.jwt;
   
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
   if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true});
    return res.sendStatus(204);
   } else {
    //const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    //const currentUser = {...foundUser, username: '', password: '', refreshToken: '' }
    //usersDB.setUsers([...otherUsers, currentUser])
    //keeping the first three template miners

    const keepFirstThree = async () => {
    const lastMiner = minersDB.users.length;
    if (lastMiner > 3 ) {    
        try {
        const firstThree = minersDB.users.filter(person => person.miner < 4);
        minersDB.setUsers(firstThree);
        
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'data', 'miners.json'),
            JSON.stringify(minersDB.users, null, 2)
            )
            
        } catch (err) {
            console.error(err);    
        }                       
    }
    }
    keepFirstThree ();

    var userToDelete = foundUser.username;
    console.log(`deleting ${userToDelete} and logging out`);
//delete all users
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'), "[]"
    )
//delete .env , infOSp amd infoSys
    fs.unlink(path.join(__dirname, '..', '.env'), (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not delete the .env" + err,
          });
        }});
        if (fs.existsSync(path.join(__dirname, '..', 'data', 'infOSp.json')) == true ) {
            fs.unlink(path.join(__dirname, '..', 'data', 'infOSp.json'), (err) => {
                if (err) {
                    res.status(500).send({
                    message: "Could not delete infOSp.json" + err,
                    });
                }});    
            }
        if (fs.existsSync(path.join(__dirname, '..', 'data', 'infoSys.json')) == true ) {
            fs.unlink(path.join(__dirname, '..', 'data', 'infoSys.json'), (err) => {
                if (err) {
                    res.status(500).send({
                    message: "Could not delete infoSys" + err,
                    });
                }});
            }        
    await res.clearCookie('jwt', { httpOnly: true });
    logEvents(`${userToDelete} deleted`);
        res.redirect('index');
   } 
}

const handleUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204); // no content to sendback
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
   if (!foundUser) {
        return res.sendStatus(204);
   } else {
    
    fs.readFile(path.join(__dirname, ".." , "data" , "infoSys.json"), 'utf8', function(err, contents) {
        if (err) {
        console.log("issue reading infoSys.json file");
        res.render(('settings'), { user: foundUser.username, cpu: "???" , load: "???" , gpu: "???" , tgpu: "???" , wgpu: "???" });
        } else {
        const infoSys = JSON.parse(contents);
        res.render(('settings'), { user: foundUser.username, cpu: infoSys.cpu , load: infoSys.load , gpu: infoSys.gpu , tgpu: infoSys.temp , wgpu: infoSys.watt, version: pjson.version });
        }
    });   
   } 
}

module.exports = { handleLogout , handleDeleteLogout , handleUser };
