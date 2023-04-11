require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const logEvents = require('./logEvents')

const checkEnv = (req, res, next) => {
if (fs.existsSync(path.join(__dirname, '../', '.env'))) {
    next();
} else {
    const a = crypto.randomBytes(64).toString('hex');
    const r = crypto.randomBytes(64).toString('hex');
    const s = Math.floor(Math.random() *4)+10;


    fs.writeFile(path.join(__dirname, '../', '.env'),
    'ACCESS_TOKEN_SECRET=' + a,
    (err) => {
        if (err) throw (err);
        fs.appendFile(path.join(__dirname, '../', '.env'),
        '\nREFRESH_TOKEN_SECRET=' + r,
        (err) => {
            if (err) throw (err);
            fs.appendFile(path.join(__dirname, '../', '.env'),
            '\nsalt=' + s,
            (err) => {
                if (err) throw (err);
                logEvents('.env created');
                console.log('log appended');
                next();
                });
        })
    })
}}  
          

module.exports = { checkEnv };