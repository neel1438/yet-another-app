/*
   Required Modules
*/

var express =require("express");
var http = require('http');
var contacts=require("./modules/contacts");
var login=require("./modules/login");
var app=express();

//server config
app.set('port',  process.env.PORT || 3000);
app.set('view engine', 'jade');

// modules used
app.use(login);
app.use(contacts);

//server create
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
 });


