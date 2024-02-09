const minersDB = {
    users: require('../../data/miners.json'),
    setUsers: function (data) { this.users = data }
}

const shell = require('shelljs');
const fetch = require('node-fetch');
const { inBetweenEvol } = require('./tools.js');
const { urlMiner } = require('../localIpUrl.js');
const { whichMiner } = require('./whichMiner.js');
//functions
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

const fetchJson = async (url, pool, w) => {
	const response = await fetch(url);
    const data = await response.json();
    const promise = new Promise((resolve, reject) => {
        try {
            switch(pool) {
                case "cedric":
                  resolve(data.mResponse.performance.workers[w].hashrate);
                  break;
                case "fastpool":
                  resolve(data);
                  break;
                default:
                    reject("pool not supported");
              }             
        } catch (err) {
            reject(err);
        }
	});
    console.log(promise);
	return promise;
}

const poolWorkerUrl = async (x) => {
    const lastMiner = minersDB.users.find(person => person.miner === x);
    const pwu = [];
    if (lastMiner.pool.search("cedric") > 0) {
        pwu[0] = "cedric";
        pwu[1] =  (lastMiner.rigName.charAt(0) == ".") ? `${lastMiner.rigName.substring(1)}` : `${lastMiner.rigName}`
        pwu[2] = `https://conceal.cedric-crispin.com/api/pool/miner/${lastMiner.wallet}`;
    } else if (lastMiner.pool.search("fastpool") > 0) {
        pwu[0] = "fastpool";
        pwu[1] =  (lastMiner.rigName.charAt(0) == "@") ? `${lastMiner.rigName.substring(1)}` : `${lastMiner.rigName}`
        pwu[2] = `https://fastpool.xyz/api-ccx//live_stats?address=${lastMiner.wallet}`;
    }
    return pwu;
}



//Main
const handleHash = async (req, res) => {
    let x = minersDB.users.length;
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
            //res.json({ hash: valueH, unit: valueU });
            poolWorkerUrl(x)
                .then((pwu) => {
                            fetchJson(pwu[2], pwu[0], pwu[1])
                                .then((value) => {
                                    res.json({ hash: valueH, unit: valueU , poolHash: value });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.json({ hash: valueH, unit: valueU , poolHash: "?"});
                                });
                })
        }    
        }
        })
        .catch((err) => {
            console.log("fetch error");
            res.json({ hash: "0", unit: "?" });
        });
}


module.exports = { handleHash };


