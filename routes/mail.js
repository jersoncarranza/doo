'use strict';

var express = require('express');
var mailController = require('../controllers/mailCntrl');
var api = express.Router();

api.post('/envio-correo',mailController.sendEmail);

module.exports = api;