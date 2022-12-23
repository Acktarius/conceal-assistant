require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const crypto = require('crypto');

const checkEnv = (req, res, next) => {
if (fs.existsSync(path.join(__dirname, '../', '.env'))) {
    next();
} else {
    const a = crypto.randomBytes(64).toString('hex');
    const r = crypto.randomBytes(64).toString('hex');
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    fs.writeFile(path.join(__dirname, '../', '.env'),
    'ACCESS_TOKEN_SECRET=' + a,
    (err) => {
        if (err) throw (err);
        fs.appendFile(path.join(__dirname, '../', '.env'),
        '\nREFRESH_TOKEN_SECRET=' + r,
        (err) => {
            if (err) throw (err);
            fs.appendFile(path.join(__dirname, '../data', 'log.txt'),
            '\n' + dateTime + '\tCreation .env',
            (err) => {
            if (err) throw (err);
            console.log('log appended');

        })
        });
    })      
}
}

module.exports = { checkEnv };