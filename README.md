# conceal-assistant

## Allows the user after authentification to check the status of node and mining services,
## and to activate or deactivate those services.

## Node service shall be named: ccx-guardian.service
## Mining service shall be named: ccx-mining.service


Node.JS, NPM, and Nodemon are required :

```
sudo apt update

sudo apt install nodejs

sudo apt install npm

sudo npm i -g nodemon
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

User admin is already created, contact @Acktarius for password

To do list:
- [x] remove the glitch which require to reload the page
- [ ] when miner deactivated, option to change miner pool and wallet

Exploring feature : 
- [ ] Creating a separated FrontEnd using Reactjs by @Ki-ll

Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it


****NOTES****
need to create a .env file with an access token and a refresh token => contact @Acktarius for more info
