# conceal-assistant

## Allows the user after authentification to check the status of node and mining services,
## and to activate or deactivate those services.

## Node service shall be named: ccx-guardian.service
## Mining service shall be named: ccx-mining.service


Node.JS and NPM are required :

```
sudo apt update

sudo apt install nodejs

sudo apt install npm
```

dependancies required are indicated in package.json

```
npm i bcrypt bluebird cookie-parser express express-flash jsonwebtoken local-ip-url pug sysctlx
```

### to run in devlopper mode (requires nodemon dependancie)
```
npm run dev
```

### Normal use
```
 node server
```

User admin is already created, contact @Acktarius for password

To do list:
- [ ] remove the glitch which require to reload the page
- [ ] when miner deactivated, option to change miner pool and wallet

Exploring feature : 
- [ ] Creating a separated FrontEnd using Reactjs by @Ki-ll

Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it

- [ ] Logout doesnt fall back on index page, nevertheless, token are correctly erased 


****NOTES****
need to create a .env file with a password for session => contact @Acktarius for more info
