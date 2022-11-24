# conceal-assistant

## allows the user after authentification to check the status of node and mining service.
## And to activate or deactivate those service

Node.JS and NPM are required :

```
sudo apt update

sudo apt install nodejs

sudo apt install npm
```

dependancies required are indicated in package.json

```
npm i bluebird
```

###to run in devlopper mode
$ npm run dev

###Normal use
$ node server

User admin is already created, contact @Acktarius for password

To be done:
- [ ] To regulate access to register page
- [ ] To allow to have more than one user ? and option to delete some user? 
- [ ] Delete user

Exploring feature : 
- [ ] Creating a separated FrontEnd using Reactjs

Known Glitch
- [ ] Some latency to load some pages, just a refresh page can solve it

- [ ] Logout doesnt fall back on index page, nevertheless, token are correctly erased 


****NOTES****
need to create a .env file with a password for session => contact @Acktarius for more info
