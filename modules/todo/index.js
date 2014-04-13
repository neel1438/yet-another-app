/**
 * 		Module dependencies.
 **/

var express = require('express');
var mongoose=require('mongoose');
var http = require('http');
var path = require('path');
var app = module.exports =express();
var config=require('../../config');


// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({secret : "qwe123"}));
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// db connection
var todoConnection=mongoose.createConnection(config.db.todoConnection);


//db schema
var todoSchema=new mongoose.Schema(config.db.todoSchema);

//instance variable
todo=todoConnection.model('user',todoSchema);

app.get("/todo",function(req,res){
	res.render("todo",{name: req.cookies.user_name});
});

//get all todos
app.get("/todos",config.checkAuth,function(req,res){
	todo.find({user_email : req.cookies.user_email},function(err,todos){
		if(err) res.render("error")		
		else
		{
			res.json(todos);
		}
	});
});

//add a todo
app.post('/todos', function(req, res) {
	todo.create({
	user_email :req.cookies.user_email,
	description : req.body.description,
	tag : req.body.tag,
	done : false
	},
	function(err, todos){
		if (err)
			res.render("error");
		todo.find({user_email : req.cookies.user_email},function(err, todos) {
			if (err) res.render("error")
			res.json(todos);
		});
	});
});

//delete a todo
app.delete('/todos/:todo_id',config.checkAuth,function(req, res){
	todo.remove({_id : req.params.todo_id},function(err, todos){
		if (err) res.render("error");
		todo.find({user_email:req.cookies.user_email},function(err, todos) {
			if (err) res.send(err)
			res.json(todos);
		});
	});
});