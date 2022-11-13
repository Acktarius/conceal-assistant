# conceal-assistant
it allows the user after authentification to check the status of node and mining service.
And to activate or deactivate those service

Node.JS and NPM are required :
$ sudo apt update

$ 'sudo apt install nodejs'

$ 'sudo apt install npm'

dependancies required are indicated in package.json

to run in devlopper mode
$ npm run dev

Normal use
$ node server

User is empty,
You'll have to register at first launch

To be done:
To regulate access to register page
To allow to have more than one user ? and option to delete some user? 

Known Glitch
Some latency to load some pages, just a refresh page can solve it

Logout doesnt fall back on index page, nevertheless, token are correctly erased 