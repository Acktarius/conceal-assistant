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

    fs.writeFile(path.join(__dirname, '../', '.env'),
    'ACCESS_TOKEN_SECRET=' + a,
    (err) => {
        if (err) throw (err);
        fs.appendFile(path.join(__dirname, '../', '.env'),
        '\nREFRESH_TOKEN_SECRET=' + r,
        (err) => {
            if (err) throw (err);
                logEvents('access and refresh Tokens written'),
                (err) => {
                if (err) throw (err);
                console.log('log appended');
        }})
        });
        logEvents('.env created');
        next();
    }      
}


module.exports = { checkEnv };