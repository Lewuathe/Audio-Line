
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('/auth/twitter');
//  res.render('index', { title: 'Happy your Birthday!' });
};

exports.login = function(req, res){
	res.render('index', { title: 'login'});
};

