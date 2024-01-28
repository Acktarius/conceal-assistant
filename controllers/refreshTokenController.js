const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
       const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
      if (!foundUser) {
    return res.status(403).render('40x', { erreur: `Forbidden` });
   } else {
   //evaluate jwt
   jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
            return res.status(403).render('40x', { erreur: `Forbidden` });
        } else {
        const accessToken = jwt.sign(
            { "username": decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' });
            res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000});
            res.status(201).redirect('main');
    }}
   );
}
}

module.exports = { handleRefreshToken };
