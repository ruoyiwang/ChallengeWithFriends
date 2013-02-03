var async    = require('async');
var express  = require('express');
var events   = require('events');
var util     = require('util');
var Dbaccess = require('./dbaccess').dbAccessor;
var qs       = require('querystring');
var mu = require('mu2');
var url = require('url');
var path = require('path');
var fs = require('fs');

var challenge_id = -1;

var dbaccess= new Dbaccess();
// create an express webserver
var app = express.createServer(
  express.logger(),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
  require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'user_likes,user_photos,user_photo_video_tags'
  })
);

app.use('/static',express.static(__dirname + '/views/static'));
app.use('/webfonts',express.static(__dirname + '/views/webfonts'));
// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});


function render_page(req, res, pgPath, option) {
    console.log(option);
    mu.root = __dirname + '/views';
    var stream = mu.compileAndRender(pgPath, option);
    util.pump(stream, res);
}

function handle_category_post_request(req, res) {
  dbaccess.createChallenge(null, req.body.category, function( match)
  {
    res.redirect('/category');
  });
}

function handle_category_get_request(req, res) {
    var cid = req.params[1];
    render_page(req,res,'challenge.html', {});
  //});
}

function handle_entry_post_request(req, res) {

  dbaccess.createEntry(null, req.challenge, function( match)
  {
    res.redirect('/category');
  });
}

function handle_get_request(req, res) {

  dbaccess.getChallenges(function (match)
  {

    var opts = {"challenge_list": match};
    render_page(req, res, 'index.html', opts);    
  });

}

function handle_index_get_request(req, res) {
  dbaccess.getEntriesByChallenge(req.data.challenge, function(match) 
  {
    render_page(req, res, 'challenge.html', {});
  });
}

// Routing the pages
app.get('/data', function (req, res) {
  var url = req.url;
	console.log("url: "+url);
	challenge_id = url.split("/").pop();
	console.log("challenge_id: "+challenge_id);
	render_page(req, res, 'data.ejs');
	console.log("challenge_id: "+challenge_id);
});
app.get('/category/(.+)/', handle_category_get_request);
app.post('/category', handle_category_post_request);
app.post('/entry', handle_entry_post_request);
app.get('/index', handle_index_get_request);
app.post('/index', handle_entry_post_request);
app.get('/', handle_get_request);
app.post('/', handle_get_request);
app.get('*', function(req, res){
	res.send('404 Sorry! Page is not found :(', 404);
});
