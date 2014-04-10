
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose=require('mongoose');
var http = require('http');
var path = require('path');
var fs = require('fs');
var config=require("../../config.js");

var app =module.exports =express();

// all environments
app.set('port',  process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.cookieParser());
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
var contactconn=mongoose.createConnection(config.db.contactconn);

//db schema
var contactSchema=new mongoose.Schema(config.db.contactSchema);

//instance variable
contacts=contactconn.model('contacts',contactSchema);

// show all contacts!!
app.get('/contacts', config.checkAuth ,function(req,res)
{
  contacts.find({user_email : req.cookies.user_email},function(err,docs)
  {
    if(err) res.json(err)
    res.render('showcontacts',{c : docs,name:req.cookies.user_name});
  });
});

// add a contact form
app.get('/contacts/new',config.checkAuth,function(req,res){
  res.render('addcontact',{name : req.cookies.user_name});
});

//adding the contact to db  and redirect to contacts page
app.post('/contacts',config.checkAuth,function(req,res){
  var newPath=__dirname+"/public/uploads/"+req.files.Image.originalFilename;
  fs.readFile(req.files.Image.path,function(err,data){
    if(err) res.send(err);
    fs.writeFile(newPath,data,function(err){
      if(err) res.send(err);
    });
  });
  var b=req.body;
  new contacts({
    user_email : req.cookies.user_email,
    name : b.name,
    place : b.place,
    email : b.email,
    phone : b.phone,
    path : "/uploads/"+req.files.Image.originalFilename
  }).save(function(err,contact){
    if(err) res.render('500',{msg: "Invalid values in fields"});
    res.redirect('/contact/'+contact._id);
  });
});

// param method to select the contact exactly---ID is unique
app.param('id' , function(req,res,next,id){
  contacts.find({_id :id,user_email : req.cookies.user_email},function(err,docs){
    if(err) res.render('404')
    else
    {
      req.contact=docs[0];
      next();
    }
  });
});

//personal contact page
app.get("/contact/:id",config.checkAuth,function(req,res){
  res.render('showcontact',{contact : req.contact,name :req.cookies.user_name});
});

//edit form
app.get('/contact/:id/edit',config.checkAuth,function(req,res){
  res.render('editcontact',{contact : req.contact,name : req.cookies.user_name});
});

// update db with edited row 
app.put('/contact/:id',config.checkAuth,function(req,res){
  var b=req.body
  if(req.files.Image.originalFilename)
  {
    var newPath=__dirname+"/public/uploads/"+req.files.Image.originalFilename;
    fs.readFile(req.files.Image.path,function(err,data){
      if(err) res.send(err);
      fs.writeFile(newPath,data,function(err){
        if(err) res.send(err);
      });
    });
    contacts.update({_id :req.params.id},
    {
      name: b.name,
      place : b.place,
      email : b.email,
      phone : b.phone,
      path : "/uploads/"+req.files.Image.originalFilename
    },
    function(err){
     if(err) res.send('error',{msg :" Update failed"})
     res.redirect("/contact/"+req.params.id)  
    });
  }
  else
  {
	  contacts.update({_id :req.params.id},
	  {  
      name: b.name,
   	  place : b.place,
   	  phone : b.phone,
   	  email : b.email
  	},
    function(err){
      if(err) res.render("error", {msg : "Contact could not be updated!"})
      res.redirect("/contact/"+req.params.id)  
    });
  }
});

app.delete('/contact/:id',config.checkAuth,function(req,res){
  contacts.remove({_id: req.params.id},function(err){
    if(err)res.send(err)
    res.redirect("/contacts")
  })
});
