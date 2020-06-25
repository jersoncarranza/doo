'use strict';
var express = require('express');
var api = express.Router();
var DIR = './uploads/';
 
var multer = require('multer');
var upload = multer({dest: DIR});
api.use(multer({
    dest: DIR,
    rename: function (fieldname, filename) {
      return filename + Date.now();
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
  }));

module.exports = api;