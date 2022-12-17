# conceal-assistant

## Allows the user after authentification to check the status of node and mining services, and to activate or deactivate those services.
Conceal-Assistant is designed for CCX-Box, therefore it's only supported to run on Linux,
Nevertheless, since it's a web server type of software, it can be consulted from any other device on the same local network using other environment(windows, mac ...)
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
```
git clone https://github.com/Acktarius/conceal-assistant.git
```
and go to this folder:
```
cd conceal-assistant
```
dependancies required are indicated in package.json
bcrypt bluebird cookie-parser express express-flash jsonwebtoken local-ip-url pug sysctlx livereload connect-livereload

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
or from an other device on the same local network: http://(ip_address_of_the_ccx_box):3500/

User admin is already created, contact @Acktarius for password

To do list:
- [x] remove the glitch which require to reload the page
- [ ] Automatic refresh of Main Page
- [ ] when miner deactivated, option to change miner pool and wallet

Exploring feature : 
- [ ] Creating a separated FrontEnd using Reactjs by @Ki-ll

Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it


****NOTES****
need to create a .env file with an access token and a refresh token => contact @Acktarius for more info
