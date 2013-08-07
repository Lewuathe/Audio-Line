var config = require("./config.json");
var twitter = require('ntwitter');

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://127.0.0.1:27017/AudioLine", function(err, db) {
	if (err) throw err;
	var collection = db.collection('user');
	collection.find({id:"Lewuathe"}).toArray(function(err, result){
		var twit = twitter({
			consumer_key : config["consumerKey"],
			consumer_secret : config["consumerSecret"],
			access_token_key : result[0]["token"],
			access_token_secret : result[0]["tokenSecret"]
		});
		twit.getUserTimeline({}, function(err, data){
			console.log(data);
		});
		db.close();
	});
});