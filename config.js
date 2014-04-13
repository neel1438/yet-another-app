module.exports.mailer={
  from: 'no-reply@yet-another-app.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth:
   {
   	 user: 'moneylover1438@gmail.com',
   	 pass: '2bhuvi8h38'
   }
};
module.exports.db = {
	userConnection : "mongodb://localhost/users",
	userSchema : {
		name : String,
		email : String,
		passwordHash : String,
		validated : Boolean,
		randomToken : String
	},
	contactConnection : "mongodb://localhost/contacts" ,
	contactSchema :  {
      	user_email: String,
      	name: String,
      	place: String,
      	email: String,
      	phone: Number,
      	path : String
    },
    moneyconn : "mongodb://localhost/money" ,
    moneySchema : {
      user_email: String,
      name: String,
      amount: Number,
      description : String,
      tag : String
    },
    todoConnection: "mongodb://localhost/todo" ,
    todoSchema : {
      user_email : String,
      description : String,
      done : Boolean,
      tag : String
    } 

};

//Checking Authentication
module.exports.checkAuth=
function(req, res, next) {
	if (!req.cookies.user_email) res.redirect('/login')
	else
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next()
	}
};
