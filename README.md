# conceal-assistant

## Allows the user after authentification to check the status of node and mining services, and to activate or deactivate those services.
Conceal-Assistant is designed for CCX-Box, therefore it's only supported to run on Linux,
nevertheless, since it's a web server type of software, it can be consulted from any other device on the same local network using other environment(windows, mac ...)
## Node service shall be named: ccx-guardian.service
## Mining service shall be named: ccx-mining.service *


Node.JS, NPM, and Nodemon are required :

```
sudo apt update

sudo apt install nodejs

sudo apt install npm

sudo npm i -g nodemon
```
to download the file in the Conceal-assistant folder :
(or download and unzip the zip file)
```
git clone https://github.com/Acktarius/conceal-assistant.git
```
and go to the folder just created:
```
cd conceal-assistant
```
dependancies required as indicated in package.json

to install, just run :
```
npm install 
```


### Normal use
```
 nodemon server
```
or
```
npm run assistant
```
open your internet Browser, and go to http://localhost:3500/
or from an other device on the same local network: http://(local_ip_address_of_the_ccx_box):3500/

User admin is already created, contact @Acktarius for password

you have the option to delete "admin" and create your own username and password via the setting page,
and you'll be redirected to register page.

Once logged in, session is active for 15minutes, nevertheless session can be refresh
during a period up to 24h, if needed.

### To do list:
- [ ] Automatic refresh of Main Page ... but is it really needed ?
- [x] when miner deactivated, option to change miner pool and wallet.
- [x] adding compatibility with Xmr-Stak and Cryptodredge.
- [x] miner setting library, auto clean-up, and remove when user deleted.

### Exploring feature : 
- [x] Creating a separated FrontEnd using Reactjs by @Ki-ll ?
- [x] adding TLS/SSL option for miner

### Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it

### Solved Glitch
- [x] at very very first boot (therefore only happens once) the page needs to be manually
refresh, it's because there are no environmental token yet and they are just being created.
- [x] automatically create access token at first use if environmental are missing
- [x] remove the glitch which require to reload the page


* assuming :
- SRBMiner-Multi is launched with a .sh file including informations (--pool --wallet -p --api-enable --api-rig-name)
- Xmr-Stak is launched with the executable xmr-stak, informations are in a pools.txt file store in the same folder as the executable ({"pool_address" "wallet_address" "rig_id" "pool_password" ) and in the config.txt file for the api ("httpd_port")
- CryptoDredge is launched with a .sh file including informations (-o stratum+tcp:// -u -p -w --api-type ccminer-tcp -b)