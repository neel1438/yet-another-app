
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose=require('mongoose');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
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
mongoose.connect("mongodb://localhost/contacts");
var contactSchema=new mongoose.Schema(
    {
      name: String,
      place: String,
      email: String,
      phone: Number
     }
    );
contacts=mongoose.model('contacts',contactSchema);

app.get('/', routes.index);

app.get('/users', user.list);

app.get('/contacts',function(req,res){
    contacts.find({},function(err,docs){
      if(err) res.json(err)
      res.render('showcontacts',{c : docs});
      });
    });

app.get('/contacts/new',function(req,res){
    res.render('addcontact');
    });

app.post('/contacts',function(req,res){
    //res.send("Contact added !");
    var b=req.body;
    new contacts({
      name : b.name,
      place : b.place,
      email : b.email,
      phone : b.phone

      }).save(function(err,contact){
      if(err) res.json(err);
      res.redirect('/contacts/'+ contact.name);
        });
    });
app.param('name' , function(req,res,next,name){
contacts.find({name: name},function(err,docs){
  req.contact=docs[0];
  next();
   });
    });

app.get("/contacts/:name",function(req,res){
  res.render('showcontact',{contact : req.contact});
  });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
