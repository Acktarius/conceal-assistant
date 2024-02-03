const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { afterUntil } = require('./forMiner/tools.js');

const netH = async (req,res,next) => {
    const explorer = await fetch('https://explorer.conceal.network/daemon/getinfo');
    let exBody = await explorer.text();
    await fsPromises.readFile(path.join(__dirname, "..", "data", "infOSp.json"), 'utf8')
        .then((data) => {
            let json = JSON.parse(data);
    
            json.networkHeight = Number(afterUntil(exBody, 'height":', ","));;
            fsPromises.writeFile(path.join(__dirname, "..", "data", "infOSp.json"), JSON.stringify(json, null, 2))
                .then(() => {console.log("infOSp.json updated")})
                .catch((err) => {console.log("error updating infOSp.json"+err)})
        })
        .catch((err) => {console.log("error reading infOSp.json" +err)});
        setTimeout(() => {
            console.log("refreshing...");
          }, "1500");
          
        next();
}


module.exports = { netH } ;