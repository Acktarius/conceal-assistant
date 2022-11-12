const express = require('express');
const router = express.Router();

const refreshTokenController = require('../controllers/refreshTokenController');

//Refresh


  router.get("/", refreshTokenController.handleRefreshToken);
    


  module.exports = router;
