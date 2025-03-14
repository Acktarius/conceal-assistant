//Copyright © 2022-2025, @Acktarius, All Rights Reserved
const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const { logEvents } = require('../middleware/logEvents')

const handleNewUser = async (req, res) => {
    // Set security headers
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });

    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'})
    //check for duplicate in the db
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) return res.status(409).render('register', { erreur: `conflict: ${user} already exist` }) //conflict
    try {
        //encrypt pwd
        const salt = parseInt(process.env.salt)
        const hashedPwd = await bcrypt.hash(pwd, salt)
        //store new user
        const newUser = { "username": user, "password": hashedPwd }
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'data', 'users.json'),
            JSON.stringify(usersDB.users)
        )
            //console.log(usersDB.users)
            console.log(`success! New user ${user} created`);
            logEvents(`${user} created`);
            res.status(201).redirect('/index');
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }