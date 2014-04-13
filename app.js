/*
   Required Modules
*/

var express =require("express");
var http = require('http');
var path = require('path');
var contacts=require("./modules/contacts");
var login=require("./modules/login");
var money=require("./modules/money");
var todo=require("./modules/todo");
var app=express();

//server config
app.set('port',  process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

//  App modules
app.use(login);
app.use(contacts);
app.use(money);
app.use(todo);
app.get('*',function(req,res){res.render('404')});

//server create
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
 });


