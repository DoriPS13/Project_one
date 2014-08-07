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

app.use(express.static(__dirname + '/public'))

app.use(cookieSession({
	secret: 'thisIsTheSecretKey',//to be changed
	name: 'cookie created by Palmer',
	maxage: 36000000000000000
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

var ramenSearchLoc = function(long, lat, callback) {
  mclient.search({name:'ramen', location:[long, lat]}, function(result){
  	var ramenResults = result.objects
    console.log('running!')
     	callback.call(ramenResults)
	});
};


var ramenSearch = function(loc, callback) {
  mclient.search({name:'ramen', locality: loc}, function(result){
  	var ramenResults = result.objects
    callback.call(ramenResults)
   
	});
};

//current location search
app.post('/geo', function(req,res) {
	// console.log('connectioniones successo')
	// console.log(req.body)
	// console.log(req.body.location.long, req.body.location.lat)
	ramenSearchLoc(req.body.location.lat, req.body.location.long, function() {
		res.render('results', {ramenResults: this, isAuthenticated: req.isAuthenticated()});
	})
});

//login request

app.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/login', 
  failureFlash: true
}));

//homepage
app.get('/', function(req,res) {
	
	res.render("home", {isAuthenticated: req.isAuthenticated(),
   });
});

//signup page
app.get('/signup', function(req,res) {
	res.render('signup',
	{ isAuthenticated: req.isAuthenticated(),
   });
})

app.post('/create', function(req,res) {
	db.user.createNewUser(req.body.username, req.body.password, 
		function(success) {
			console.log("Success!!")
			res.redirect('/')
		},
		function(err) {
			console.log("ERRORED")
			res.redirect("/signup")
		})
})
//search by location
app.post('/search', function(req,res) {
	console.log(req.body.location)
	var loc = (req.body.location)
	ramenSearch(loc, function() {
				// console.log(this)
		res.render('results', {
			ramenResults: this,
			isAuthenticated: req.isAuthenticated()
		});
	})	
});
//results 
app.get('/results', function(req,res) {

})

 app.get('/ramen/:id', function(req,res) {
	var ramenId = req.params.id
	db.item.find({ where: {
		locuId: ramenId }
	}).success(function(ramenItem) {
		var rating = 'N/A'
		if (ramenItem !== null) {
			rating = ramenItem.rating
		}
		mclient.request(ramenId, null, function (detailThing) { 
			res.render('single_result', {
				ramenResult: detailThing.objects,
				rating: rating,
				isAuthenticated: req.isAuthenticated()
			})
		});
	});
})


app.post('/ramen/:locu_id', function(req, res){
	if (req.user){
		locuId = req.params.locu_id
		db.item.findOrCreate({
				locuId: locuId
		}).success(function(item, created){
			if(created){
				item.rating = req.body.score
				item.ratingCount = 1;
				item.save()
			} else {
				var oldRating = item.rating;
				var oldCount = item.ratingCount;

				var newRating;
				newRating = (oldRating*oldCount + Number(req.body.score))/(oldCount + 1)

				item.rating = newRating;
				item.ratingCount += 1;
				item.save().success(function(item){
					
				})
				req.user.addItem(item);
			}
			// res.(item)
		})
	 }
})



//rating

//logout
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/')
});



app.listen(process.env.PORT || 3000, function() {
	console.log('Systems Online on Port 3000 Captian')
})