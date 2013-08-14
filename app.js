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
  , MongoClient = require('mongodb').MongoClient;

var app = express();


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
    // asynchronous verification, for effect...
	var username = profile["username"];
	passport.session.accessToken = token;
	passport.session.profile     = profile;
	MongoClient.connect('mongodb://127.0.0.1:27017/AudioLine', function(err, db) {
		if (err) throw err;
		var collection = db.collection('user');
		collection.find({id:username}).toArray(function(err, result) {
			if (result.length > 0) {
				done(null, profile);
			}
			else {
				collection.insert({id:username,token:token, tokenSecret:tokenSecret}, function(err, docs) {
					db.close();
					done(null, profile);
				});
			}
		});
	});
  }
));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
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
	res.redirect('/auth/twitter');
	//  res.render('login', { user: req.user });
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
    res.redirect('/');
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