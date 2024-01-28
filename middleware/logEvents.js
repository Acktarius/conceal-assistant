const { format } = require('date-fns');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${message}\n`;
    try {
        await fsPromises.appendFile(path.join(__dirname, '../data', 'log.txt'), logItem);
    } catch (err) {
        console.log(err);
    }
}

const doubleLogEvents = async (context, message) => {
    console.log(`${context}: ${message}`);
    await logEvents(message);
}

module.exports = { logEvents , doubleLogEvents };
