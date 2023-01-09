# conceal-assistant

## Allows the user after authentification to check the status of node and mining services, and to activate or deactivate those services.
Conceal-Assistant is designed for CCX-Box, therefore it's only supported to run on Linux,
nevertheless, since it's a web server type of software, it can be consulted from any other device on the same local network using other environment(windows, mac ...)
## Node service shall be named: ccx-guardian.service
## Mining service shall be named: ccx-mining.service


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
dependancies required are indicated in package.json
bcrypt bluebird cookie-parser date-fns express express-flash jsonwebtoken local-ip-url pug sysctlx livereload connect-livereload
to install just run :
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
- [ ] when miner deactivated, option to change miner pool and wallet...in progress

### Exploring feature : 
- [ ] Creating a separated FrontEnd using Reactjs by @Ki-ll ?

### Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it

### Solve Glitch
- [x] at very very first boot (therefore only happens once) the page needs to be manually
refresh, it's because there are no environmental token yet and they are just being created.
- [x] automatically create access token at first use if environmental are missing
- [x] remove the glitch which require to reload the page