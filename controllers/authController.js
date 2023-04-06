const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const { extractInfo } = require('../middleware/forMiner/extractInfo');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'})
   const foundUser = usersDB.users.find(person => person.username === user)
   if (!foundUser) return res.status(401).render('login', { erreur: `${user} , no such user` })
   //evaluate password
   if (await bcrypt.compare(pwd, foundUser.password)) {
    //jwt
    const accessToken = jwt.sign(
        { "username": foundUser.username }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '15m' })
        
    const refreshToken = jwt.sign(
        { "username": foundUser.username }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '3h' })
        //Saving refresh Token with current user valid for 3 hours
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'data', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        
        res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000});
        //res.json({ accessToken });
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000});
        extractInfo(); 
        res.status(201).redirect('main');        
   } else {
    res.status(401).render('login', { user: user, erreur: `wrong password` })
   }
}

module.exports = { handleLogin };
