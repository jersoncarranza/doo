'use strict';
var express = require('express');
var serverless = require("serverless-http");
var app = express();
var bodyParser = require('body-parser');
var user_routes = require('./routes/user');
var match_routes= require('./routes/match');
var point_routes = require('./routes/point');
var country_routes = require('./routes/country');
var email_routes = require('./routes/mail');
var admin_routes = require('./routes/adminRoute');
const router = express.Router();
//var multerfile = require('./routes/multer');
var multer = require('multer');
var fs = require('fs');
var DIR = './uploads/';
var upload = multer({dest: DIR});
// middlewares -- antes de llegar al controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//app.use('s',multerfile);

router.get("/", (req, res) => { res.json({  hello: "hi!"   }); });app.use('/user',user_routes);
app.use('/user',user_routes);
app.use('/email',email_routes);
app.use('/match', match_routes);
app.use('/point',  point_routes);
app.use('/country',  country_routes);
app.use('/admin',  admin_routes);

app.use(`/api`, router);

module.exports = app;
module.exports.handler = serverless(app);