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

const handleHash = async (req, res) => {
    curlMiner(urlMiner)
        .then((data) => {
        if ((whichMiner != "xmr") && (whichMiner != "srb")) {
        res.json({ hash: "unknown", unit: "?" });
        } else {
        let hashd = (whichMiner == "xmr") ? 'Totals:</th><td> ' : (whichMiner == "srb") ? 'minute</th><td>' : 'tbd';
        let hashf = (whichMiner == "xmr") ? '</td>' : (whichMiner == "srb") ? ' ' : 'tbd';
        let valueH = inBetweenEvol(data, hashd, hashf);
        let unitd = (whichMiner == "xmr") ? "<th rowspan='6'>" : (whichMiner == "srb") ? `${valueH} ` : 'tbd';
        let unitf = (whichMiner == "xmr") ? '</td>' : (whichMiner == "srb") ? '</td>' : 'tbd';
        let valueU = inBetweenEvol(data, unitd, unitf);
        if ( valueH.length > 20 ) {
            return res.json({ hash: "not known yet ", unit: valueU });
        } else {
            res.json({ hash: valueH, unit: valueU });
        }
        }
        })
        .catch((err) => {
            console.log("fetch error");
            res.json({ hash: "0", unit: "?" });
        });
}


module.exports = { handleHash };
