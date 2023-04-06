const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
require('dotenv').config()

const fsPromises = require('fs').promises
const { appendFile } = require('fs')
const path = require('path')

const logEvents = require('../middleware/logEvents')
const { remover } = require('../middleware/forMiner/remover');
const { infoCpu, infoLoad, infoGpu, tempGpu, wattGpu } = require('../middleware/sysInfo')

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
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'miners.json'), "[]"
    )
    await fsPromises.unlink(
        path.join(__dirname, '..', '.env')
    )
    console.log('delete user and logging out');
    var userToDelete = foundUser.username
    logEvents(`${userToDelete} deleted`)
    res.clearCookie('jwt', { httpOnly: true });
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
    res.render(('settings'), { user: foundUser.username, cpu: infoCpu , load: infoLoad , gpu: infoGpu , tgpu: tempGpu , wgpu: wattGpu });
   } 
}

module.exports = { handleLogout , handleDeleteLogout , handleUser };
