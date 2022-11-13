const express = require('express');
const router = express.Router();

const refreshTokenController = require('../controllers/refreshTokenController');


  //refresh

  router.get("/", refreshTokenController.handleRefreshToken);
    


  module.exports = router;
