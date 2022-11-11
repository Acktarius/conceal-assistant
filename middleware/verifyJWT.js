const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    //const authHeader = req.headers['authorization']
    const authCookie = req.cookies.access_token;
    //if (!authHeader) return res.sendstatus(401)
    if (!authCookie) return res.status(401).render('40x', { erreur: 'NO Token' })
    //console.log(authHeader) // Bearer token
    //console.log(authCookie)
    //const token = authHeader.split(' ')[1]
    const token = authCookie
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) { 
            return res.status(403).render('40x', { erreur: 'invalid Token' }); //invalid Token
            } else {
                req.user = decoded.username;
            next();
            }
        }
    )
}

module.exports = verifyJWT;