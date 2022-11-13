const express = require('express');
const router = express.Router();

const logoutController = require('../controllers/logoutController');


  //Logout

  router.get("/logout", logoutController.handleLogout, (req, res) => {
  res.render("index");
});
    


  module.exports = router;
