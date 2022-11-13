//get local IP and build URL 
const localIpUrl = require('local-ip-url');

const localIp = localIpUrl('public')
const urlNode = 'http://' + localIp + ':8080/index.html'
const urlMiner = 'http://' + localIp + ':21550/stats'


module.exports = { urlNode , urlMiner };
