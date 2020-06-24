'use strict';
var express = require('express');
var api = express.Router();
var userMiddleware = require('../middlewares/authenticated');
var adminController = require('../controllers/adminCntrl');
//Admin
api.get('/users-client/:page?',     userMiddleware.ensureAuth, adminController.getUsersClientPage);
api.post('/change-estado',          userMiddleware.ensureAuth, adminController.changeEstadoUser);
api.get('/users-model/:page?',      userMiddleware.ensureAuth, adminController.getModelsPage);
api.get('/users-model-all/:page?',  userMiddleware.ensureAuth, adminController.getModelsPageAll);

module.exports = api;