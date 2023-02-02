//get local IP and build URL 
const localIpUrl = require('local-ip-url');

const minersDB = {
    users: require('../data/miners.json'),
    setUsers: function (data) { this.users = data }
  }


const { whichMiner } = require('./forMiner/whichMiner');

const lastMiner = minersDB.users.length;
const foundMiner = minersDB.users.find(person => person.miner === lastMiner)

const localIp = localIpUrl('public');
const urlNode = 'http://' + localIp + ':8080/index.html';
const urlMiner = (whichMiner == "srb") ? `http://${localIp}:21550/stats` : (whichMiner == "xmr") ? `http://${localIp}:${foundMiner.apiPort}` : (whichMiner == "crd") ? `http://${localIp}:3500/noapi` : `http://${localIp}:3500/noapi`;

module.exports = { urlNode , urlMiner };