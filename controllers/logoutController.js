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
const fsPromises = require('fs').promises
//const { appendFile } = require('fs')
const path = require('path')

const logEvents = require('../middleware/logEvents')
const { remover } = require('../middleware/forMiner/remover');
const deleteOFP = require('../middleware/forMiner/deleteOFP');
const { sysInfo , mapSI } = require('../middleware/sysInfo');

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
        )
    res.clearCookie('jwt', { httpOnly: true });
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
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'), "[]"
    )
/*
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'miners.json'), "[]"
    )
*/
//keeping the first two template miners
    const lastMiner = minersDB.users.length;
    if (lastMiner > 2 ) {
        for (let i = 3; i <= lastMiner; i++) {
            deleteOFP(i);    
            } 
    }
//delete .env
    fs.unlink(path.join(__dirname, '..', '.env'), (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not delete the .env" + err,
          });
        }})

    console.log('delete user and logging out');
    var userToDelete = foundUser.username;
    logEvents(`${userToDelete} deleted`);
    await res.clearCookie('jwt', { httpOnly: true });
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
    sysInfo();
    res.render(('settings'), { user: foundUser.username, cpu: mapSI.get('cpu') , load: mapSI.get('load') , gpu: mapSI.get('gpu') , tgpu: mapSI.get('temp') , wgpu: mapSI.get('watt') });

   } 
}

module.exports = { handleLogout , handleDeleteLogout , handleUser };
