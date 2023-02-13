const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}

const alreadyLoggedIn = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return next();
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        return next;
    } else {
    console.log("already logged in !")    
    return res.redirect('/main');
    }
}


module.exports = { alreadyLoggedIn };
