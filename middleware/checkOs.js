//get the OS 
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');

const osName = process.platform;

const checkLinuxOs = (req, res, next) => {
      const linuxOs = () => {
      if (osName.startsWith('linux')) {
      	return true
      	} else {
      	return false
      	}}	
      if (linuxOs() == false) { 
      console.log('wrong OS');
      res.redirect('/index');
    } else { 
    return next();
    }
  };

module.exports = { checkLinuxOs };
