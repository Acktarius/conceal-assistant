//get Ip
const { daemonHost } = require('../localIpUrl');
//declare CCX
const CCX = require('conceal-api')
const ccx = new CCX({
  daemonHost: `${daemonHost}`, 
  daemonRpcPort: 16000
})

module.exports = { ccx } ;