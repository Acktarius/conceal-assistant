//get the OS 
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
