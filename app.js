var express = require('express'),
		passportLocal = require('passport-local'),
  	cookieSession = require("cookie-session"),
		cookieParser = require("cookie-parser"),
		bodyParser = require('body-parser'),
		passport = require('passport'),
		flash = require('connect-flash'),
		locu = require('locu'),
		app = express(),
		db = require('./models/index');
		

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extend: true}));

app.use(cookieSession({
	secret: 'thisIsTheSecretKey',//to be changed
	name: 'cookie created by Palmer',
	maxage: 360000
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//for checking if user has authori
passport.serializeUser(function(user,done) {
	done(null,user.id)
})

passport.deserializeUser(function(id,done) {
	db.user.find({
		where: {
			id: id
		}
	}).done(function(error,user) {
		//slightly confusing
		done(error,user);
	})
})
//ramen search by location need to add if error
var mclient = new locu.MenuItemClient(process.env.locuKey); 

var ramenSearch = function(loc, callback) {
	  mclient.search({name:'ramen', locality: loc}, function(result){
	  	var ramenResults = result.objects
	  	console.log(result.objects)
	     // console.log(result.objects[0].name);
	     	callback.call(ramenResults)
	   
	});
};

//homepage
app.get('/', function(req,res) {
	res.render('home')
})

//login request

app.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/login', 
  failureFlash: true
}));



//signup page
app.get('/signup', function(req,res) {
	res.render('signup')
})

app.post('/create', function(req,res) {
	db.user.options.classMethods.createNewUser(req.body.username, req.body.password, 
		function(err) {
			// console.log(err);
		},
		function(success) {
			res.render('home_si')
		})
})
//search 
app.post('/search', function(req,res) {
	console.log(req.body.location)
		var loc = (req.body.location)
			ramenSearch(loc, function() {
				// console.log(this)
				res.render('results', {ramenResults: this});
					// console.log('ran')
			})
		
});
//results 
app.get('/results', function(req,res) {

})

 app.get('/ramen/:id', function(req,res) {
	var ramenId = req.params.id

		mclient.request(ramenId, null, function (detailThing) {
		res.render('single_result', {ramenResult: detailThing.objects})
	});
});


//single spot authorized

//rating

//save spots 

app.listen(3000, function() {
	console.log('Systems Online on Port 3000 Captian')
})