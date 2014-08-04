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
	secret: 'thisIsTheSecretKey',
	name: 'cookie created by Palmer',
	maxage: 360000
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//for checking if user has authori
passport.serializeUser(function(user,done) {
	done(null,user,id)
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
//ramen search by location
var ramenSearch = function(loc, callback) {
	var mclient = new locu.MenuItemClient(process.env.locuKey); 
	  mclient.search({name:'ramen', locality: loc}, function(result){
	  	var ramenResults = result.objects
	     // console.log(result.objects[0].name);
	     	callback.call(ramenResults)
	   
	});
};

//homepage
app.get('/', function(req,res) {
	res.render('home')
})

//login request

//signup page

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
//single spot not authorized
app.get('/results/:id', function(req,res) {
	var ramenId = req.params.id
	console.log(ramenId)
		var singleRamen = function(ramenId, callback) {
			var menu_client = new locu.MenuItemClient(process.env.locuKey); 
			//need to figure out what is needed to search for ID should go like this 
			//http://api.locu.com/v1_0/menu_item/{menu item Locu id}/?api_key={your API key}
			  menu_client.search({id: ramenId}, function(result){ 
			  	var ramenResult = result.objects
			     // console.log(result.objects[0].name);
			     	callback.call(ramenResult)
			  
	  	})
  	}
	 singleRamen(ramenId, function() {
	  res.render('single_result', {ramenResult: this});
	})
});

//single spot authorized

//rating

//add to favorites

//save spots 

app.listen(3000, function() {
	console.log('Systems Online on Port 3000 Captian')
})