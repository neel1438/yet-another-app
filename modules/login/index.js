
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose=require('mongoose');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bcrypt=require('bcrypt');
var app = module.exports =express();

// all environments
app.set('port',  process.env.PORT || 3000);
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
app.get('/',function(req,res){
		if(req.cookies.user_name) res.render('home',{name : req.cookies.user_name})
		else res.render('index')
		});

// db connection
var userconn=mongoose.createConnection("mongodb://localhost/users");

//db schema
var userSchema=new mongoose.Schema(
		{
name: String,
email: String,
passwordhash: String
}
);
//instance variable
user=userconn.model('user',userSchema);

function checkauth(req, res, next) {
	if (!req.cookies.user_email) {
		res.redirect('/login')
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next()
	}
}




// add a signup form
app.get('/signup',function(req,res){
		if(req.cookies.user_email) res.send("already logged in! Please logout out first!")
		else res.render('signup');
		});
//login page
app.get('/login',function(req,res){
		if(req.cookies.user_email) res.send("Already logged in");
		else res.render('login');
		});
app.post('/loginuser',function(req,res){
		var b=req.body;
		user.find({email : b.email},function(err,docs){
			if(!docs[0]) res.render('error',{msg : "Invalid Username"});
			else{
			var lol=docs[0];
			bcrypt.compare(b.password,lol.passwordhash, function(err,isloggedin) {	
			if(isloggedin)
			{
			res.cookie('user_email',b.email)
			res.cookie('user_name',lol.name)
			res.redirect('/home')
			}
			else res.render('error',{msg: "Wrong Password"})
			});
			}
			});
		});

//singup form submission
app.post('/newuser',function(req,res){
		var b=req.body;
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(b.password, salt, function(err, hash) {
				if(err) throw err;
				else 
				{
				var userobj={

						name : b.name,
						email :b.email,
						passwordhash : hash
						}
				new user(userobj).save(function(err,userobj){
				if(err) throw err;
				else
				{
					res.cookie('user_email',b.email)
					res.cookie('user_name',b.name)
					res.redirect('/home');
				}
				});

				}
			});
		});

});
app.get('/home',checkauth,function(req,res)
		{
		res.render('home',{name : req.cookies.user_name});
		});
app.get('/logout',checkauth,function(req,res){
		res.clearCookie('user_email');
		res.clearCookie('user_name');
		res.redirect('/');
		});
