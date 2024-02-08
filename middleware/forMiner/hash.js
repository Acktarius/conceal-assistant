const exec = require('shelljs.exec');
const shell = require('shelljs');
const fetch = require('node-fetch');
const { inBetweenEvol } = require('./tools.js');
const { urlMiner } = require('../localIpUrl.js');
const { whichMiner } = require('./whichMiner.js');

const curlMiner = async (url) => {
	const response = await fetch(url);
    const body = await response.text();
    const promise = new Promise((resolve, reject) => {
        try {
            resolve(body);
        } catch (err) {
            reject(err);
        }
	});
	return promise;
}



let hashd = (whichMiner == "xmr") ? 'Totals:</th><td> ' : (whichMiner == "srb") ? 'tbd' : 'tbd';
let hashf = (whichMiner == "xmr") ? '</td>' : (whichMiner == "srb") ? 'tbd' : 'tbd';
let unitd = (whichMiner == "xmr") ? "<th rowspan='6'>" : (whichMiner == "srb") ? 'tbd' : 'tbd';
let unitf = (whichMiner == "xmr") ? '</td>' : (whichMiner == "srb") ? 'tbd' : 'tbd';


const handleHash = async (req, res) => {
    curlMiner(urlMiner)
        .then((data) => {
        let valueH = inBetweenEvol(data, hashd, hashf);
        let valueU = inBetweenEvol(data, unitd, unitf);
        res.json({ hash: valueH, unit: valueU });
        });
}


module.exports = { handleHash };
