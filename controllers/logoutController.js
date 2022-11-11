const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    //delete access_token cookie
    if (cookies?.access_token) {
        res.clearCookie('access_token', { httpOnly: true});
    }
    
    //delete refreshToken cookie and update users.json
    if (!cookies?.jwt) return res.sendStatus(204); // no content to sendback
    const refreshToken = cookies.jwt;
   
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
   if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true});
    return res.sendStatus(204);
   } else {
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', { httpOnly: true});
    res.redirect('index');
   } 
}

module.exports = { handleLogout };