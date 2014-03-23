
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose=require('mongoose');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app =module.exports =express();

// all environments
app.set('port',  process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({secret: 'qwe123'}))
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
// check auth
function checkauth(req, res, next) {
		if (!req.session.user_email) {
			res.redirect('/login')
		} else {
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			next()
	}
	}

// db connection
var contactconn=mongoose.createConnection("mongodb://localhost/contacts");

//db schema
var contactSchema=new mongoose.Schema(
    {
      user_email: String,
      name: String,
      place: String,
      email: String,
      phone: Number,
      path : String
     }
    );
//instance variable
contacts=contactconn.model('contacts',contactSchema);

// show all contacts!!
app.get('/contacts',checkauth,function(req,res){
    contacts.find({user_email : req.session.user_email},function(err,docs){
      if(err) res.json(err)
      res.render('showcontacts',{c : docs});
      });
    });

// add a contact form
app.get('/contacts/new',checkauth,function(req,res){
    res.render('addcontact');
    });

//adding the contact to db  and redirect to contacts page
app.post('/contacts',checkauth,function(req,res){
    //res.send("Contact added !");
   // console.log(req.files);
    var newPath=__dirname+"/public/uploads/"+req.files.Image.originalFilename;
    fs.readFile(req.files.Image.path,function(err,data){
      if(err) res.send(err);
      fs.writeFile(newPath,data,function(err){
        if(err) res.send(err);
        });
      });
    var b=req.body;
    new contacts({
      user_email : req.session.user_email,
      name : b.name,
      place : b.place,
      email : b.email,
      phone : b.phone,
      path : "/uploads/"+req.files.Image.originalFilename
      }).save(function(err,contact){
      if(err) res.json(err);
      res.redirect('/contact/'+ contact._id);
        });
     });

// param method to select the contact exactly---ID is unique
app.param('id' , function(req,res,next,id){
contacts.find({_id :id,user_email : req.session.user_email},function(err,docs){
  req.contact=docs[0];
  next();
   });
    });

//personal contact page
app.get("/contact/:id",checkauth,function(req,res){
  res.render('showcontact',{contact : req.contact});
  });

//edit form
app.get('/contact/:id/edit',checkauth,function(req,res){
    res.render('editcontact',{contact : req.contact});
    });

// update db with edited row 
app.put('/contact/:id',checkauth,function(req,res){
   // console.log(req.files);
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
    path : "/uploads/"+req.files.Image.originalFilename
  },function(err){
  if(err) res.send(err)
  res.redirect("/contact/"+req.params.id)  
  });
    }
    else
    {
	   contacts.update({_id :req.params.id},
		 {  
   			 name: b.name,
   			 place : b.place,
   			 email : b.email,
  		},function(err){
  if(err) res.send(err)
  res.redirect("/contact/"+req.params.id)  
  });
 }
  });

app.delete('/contact/:id',checkauth,function(req,res){
    contacts.remove({_id: req.params.id},function(err){
      if(err)res.send(err)
      res.redirect("/contacts")
      })
    });
