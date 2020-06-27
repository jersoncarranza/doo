'use strict';
var http	    = require('http');
var mongoose    = require('mongoose');
var PORT        =  process.env.PORT || 4000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var conf    = require('./conf.json');
var app = require('./app');
const serverless = require("serverless-http");

var server = http.createServer(app);
//var server = serverless(app);

mongoose.Promise = global.Promise;
//const uri = 'mongodb://localhost:27017/matchTest';
const uri = "mongodb+srv://"+ conf.db.user+":"+ conf.db.password +"@"+conf.db.host+".azure.mongodb.net/dbmatch?retryWrites=true&w=majority";

//const uri = "mongodb+srv://"+conf.db.user+":"+conf.db.password+"@"+conf.db.host+".mongodb.net/test?retryWrites=true&w=majority";
//const uri = "mongodb+srv://usermatch:XKbJNOoGkbJVvqxn@clusterboom-9u5xr.azure.mongodb.net/dbmatch?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true,  useUnifiedTopology:true})
.then(() =>{
    
       server.listen(PORT , server_host, function () {console.log(`Listening on ${ PORT }`) });

})
.catch(err => console.log(err));

