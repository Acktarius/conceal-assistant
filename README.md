# conceal-assistant

## Allows the user after authentification to check the status of node and mining services, and to activate or deactivate those services.
Conceal-Assistant is designed for CCX-Box, therefore it's only supported to run on Linux,
nevertheless, since it's a web server type of software, it can be consulted from any other device on the same local network using other environment(windows, mac ...)
## Node service shall be named: ccx-guardian.service
## Mining service shall be named: ccx-mining.service (1)

**2 miner templates are available for purpose of guidance , and if used, would be mining to Conceal Network donation address**


Node.JS, NPM, and Nodemon are required, sensors is needed to get Gpu temp and power info :

```
sudo apt update

sudo apt install nodejs

sudo apt install npm

sudo npm i -g nodemon

sudo apt install lm-sensors
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

to install, just run (you might need sudo, depending where your folder is located):
```
npm install 
```


### Normal use
```
npm run assistant
```
or
```
nodemon server.js
```
### Superior permission are needed to modify mining service or node upgrade
```
sudo nodemon server.js
```
open your internet Browser, and go to http://localhost:3500/
or from an other device on the same local network: http://(local_ip_address_of_the_ccx_box):3500/

you have to register a new user at first use, this will create unique random environmental variables.
the setting page gives you the option to delete a user and then  you'll be redirected to register page.

Once logged in, session is active for 15minutes, nevertheless session can be refresh
during a period up to 3h, if needed. (the refresh button appears on 'mouse-over' effect in the banner)

### To do list:
- [ ] Automatic refresh of Main Page ... but is it really needed ?
- [x] when miner deactivated, option to change miner pool and wallet.
- [x] adding compatibility with Xmr-Stak and Cryptodredge.
- [x] miner setting library, auto clean-up, and remove when user deleted.

### Recently added feature :
- [x] adding TLS/SSL option for miner
- [x] assistance to upgrade node or miner
- [x] improve scroll through section in main and settings pages

### Known Glitch
- [ ] Gpu name doesn't show in 'System info' when launch via a service
- [x] Some latency to load some pages, just a refresh page can solve it
- [ ] automatic refresh doesn't work if using a Firewall or router prevailing access to the liveReload server?

### Solved Glitch
- [x] at very very first boot (therefore only happens once) the page needs to be manually
refresh, it's because there are no environmental token yet and they are just being created.
- [x] automatically create access token at first use if environmental are missing
- [x] Credits are now in a collapssible box preventing overlapping
- [x] Bug correction when deleting user and his flight sheet.

(1) assuming :
- SRBMiner-Multi is launched with a .sh file including informations (--pool --wallet -p --api-enable --api-rig-name)
- Xmr-Stak is launched with the executable xmr-stak, informations are in a pools.txt file store in the same folder as the executable ({"pool_address" "wallet_address" "rig_id" "pool_password" ) and in the config.txt file for the api ("httpd_port")
- CryptoDredge is launched with a .sh file including informations (-o stratum+tcp:// -u -p -w --api-type ccminer-tcp -b)