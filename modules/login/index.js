/**
 * 		Module dependencies.
 **/


var express = require('express');
var mongoose=require('mongoose');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bcrypt=require('bcrypt');
var app = module.exports =express();
var mailer=require('express-mailer');
var crypto=require('crypto');
var config=require('../../config');


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

// mailer config 
mailer.extend(app,config.mailer);

// db connection
var userconn=mongoose.createConnection(config.db.userconn);


//db schema
var userSchema=new mongoose.Schema(config.db.userSchema);

//instance variable
user=userconn.model('user',userSchema);



// '/' route  
app.get('/',function(req,res){
	if(req.cookies.user_name) res.render('home',{name : req.cookies.user_name})
	else res.render('index')
});


// add a signup form
app.get('/signup',function(req,res){
	if(req.cookies.user_email) res.render("error",{msg : "Already logged in! Please logout out first!"})
	else res.render('signup');
});


//singup form submission
app.post('/newuser',function(req,res){
	var b=req.body;
	var Rtoken;
	crypto.randomBytes(48,function(ex,buf){
		Rtoken=buf.toString('hex');
	});
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(b.password, salt, function(err, hash) {
			if(err) res.render("error",{msg : "error registering new user"});
			else 
			{
				var userobj={
					name : b.name,
					email :b.email,
					passwordHash : hash,
					randomToken : Rtoken,
					validated : false
					}
				new user(userobj).save(function(err,userobj){
					if(err) throw err;
					else{
						app.mailer.send('invite', {
						from : "noreply@yap.com",
  						to: b.email, 
   						subject: 'Confirm your registration on yet-another-app', 
    					name: b.name,
    					token : Rtoken 
  						},
  						function (err) {
    						if (err) {
           					console.log(err);
    						res.render('error' ,{msg:'There was an error sending the email'});
    						}
    					res.render("validate", {msg:"Email Sent! Confirm Your Email Address "});
  						})
					}
				});
			}
		});
	});
});

//token searching
app.param('token',function(req,res,next,token){
	user.find({randomToken : token},function(err,docs){
		if(!docs[0]) res.render("error",{msg :"Invalid token to confirm registration"})
		else
		{
			req.user=docs[0];
			next();
		}
	});
});

// confirming User Email id
app.get('/invite/:token',function(req,res){
	user.update({randomToken :req.user.randomToken},{validated : true},function(err){
		if(err) res.render("error",{msg:"Could not validate the user try again"});
		else
		{	
			res.cookie('user_email',req.user.email)
			res.cookie('user_name',req.user.name)
			res.redirect('/home');
		}
	});
});

//login page
app.get('/login',function(req,res){
	if(req.cookies.user_email) res.send("error",{msg :"Already logged in!! Please logout first"});
	else res.render('login');
});


// login submission
app.post('/loginuser',function(req,res){
	var b=req.body;
	user.find({email : b.email},function(err,docs){
		if(!docs[0]) res.render('error',{msg : "Invalid Username"});
		else{
			var lol=docs[0];
			if(lol.validated)
			{
				bcrypt.compare(b.password,lol.passwordHash, function(err,isloggedin) {	
				if(isloggedin)
				{
					res.cookie('user_email',b.email)
					res.cookie('user_name',lol.name)
					res.redirect('/home')
				}
				else res.render('error',{msg: "Wrong Password"})
				});
			}
			else
			{
				res.render("validate",{msg:"Please Validate Your Email Address"})
			}
		}
	});
});	

// Home page
app.get('/home',config.checkAuth,function(req,res){
	res.render('home',{name : req.cookies.user_name});
});

//Settings Page
app.get("/settings",config.checkAuth,function(req,res){
	user.find({email : req.cookies.user_email},function(err,docs){
		res.render("settings",{name : req.cookies.user_name,c :docs[0]})
	});
});

//change password 
app.post("/changepasswd",config.checkAuth,function(req,res){
	var b=req.body;
	bcrypt.genSalt(10, function(err, salt) {
 		bcrypt.hash(b.password, salt, function(err, hash) {
			if(err) throw err;
			else 
			{
				user.update({email : req.cookies.user_email},
				{
					passwordHash : hash
				},
				function(err){
					if(err) res.render("error",{msg: "Password could not be updated"});
					res.redirect("/settings");
				});
			}	
		});
	});
});

//Logout function
app.get('/logout',config.checkAuth,function(req,res){
	res.clearCookie('user_email');
	res.clearCookie('user_name');
	res.redirect('/');
});
