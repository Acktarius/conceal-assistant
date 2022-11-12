const express = require('express');
const router = express.Router();

const refreshTokenController = require('../controllers/refreshTokenController');


  //Logout

  router.get("/", refreshTokenController.handleRefreshToken);
    


  module.exports = router;