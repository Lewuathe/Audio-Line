/*
 * Module dependencies.
 */

var config = require('./config.json');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , MongoClient = require('mongodb').MongoClient
  , twitter = require('ntwitter');

var app = express();

var gProfile;
var gToken;
var gTokenSecret;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config["consumerKey"],
    consumerSecret: config["consumerSecret"],
	callbackURL : "http://" + config["host"] + ":3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
	gProfile = profile;
	gToken   = token;
	gTokenSecret = tokenSecret;
	done(null, profile);
    // asynchronous verification, for effect...
  }
));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('your secret here'));
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',  routes.index);

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('index', { title: 'account'} );
//  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	var userid = "";
	console.log(gToken);
	console.log(gTokenSecret);
	var twit = twitter({
		consumer_key : config["consumerKey"],
		consumer_secret : config["consumerSecret"],
		access_token_key : gToken,
		access_token_secret : gTokenSecret
	});
	twit.getUserTimeline({count:200}, function(err, data) {
		var tweets = [];
		for (var i = 0; i < data.length; i++ ) {
			var tweet = [];
			for (var j = 0; j < data[i]["text"].length; j++) {
				var buf = new Buffer(data[i]["text"]);
				tweet.push(buf.readInt8(j));
			}
			tweets.push(tweet);
		}
		res.render('audioline', { tweets: tweets });
	});
});

// GET /auth/twitter
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to twitter.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/login');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
