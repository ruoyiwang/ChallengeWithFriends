var async    = require('async');
var express  = require('express');
var events   = require('events');
var util     = require('util');
var mongoose = require('mongoose');
var Dbaccess = require('./dbaccess').dbAccessor;
var qs       = require('querystring');
var url = require('url');
var path = require('path');

var challenge_id = -1;

Eventer = function(){
  events.EventEmitter.call(this);
  this.createChallenge = function( creator, inTitle, inType, inMinmax ){
    this.emit('createChallenge',  creator, inTitle, inType, inMinmax );
  }

  this.createEntry = function(creator, inTitle, inChallenge, inMetric, inContent ){
    this.emit('createEntry', creator, inTitle, inChallenge, inMetric, inContent );
  }
 };

util.inherits(Eventer, events.EventEmitter);

Listener = function(){
  this.createChallengeHandler =  function( creator, inTitle, inType, inMinmax ){
    //console.log('works');
    dbaccess.createChallenge( creator, inTitle, inType, inMinmax );
  },
  this.createEntryHandler = function(creator, inTitle, inChallenge, inMetric, inContent ){
    dbaccess.createEntry(userId, Value, challengeName);
  }
};

var eventer = new Eventer();
var listener = new Listener(eventer);

eventer.on('createChallenge',listener.createChallengeHandler);
eventer.on('createEntry',listener.createEntryHandler);

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
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

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

function render_page(req, res, pgPath, option) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render(pgPath, option);
    });
  });
}

function handle_post_request(req, res) {
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
      var POST = qs.parse(body);
      if (req.body.buttonClicked == 'gotoChallenge')
      {
        render_page(req,res,'challenge', {})
      }
      else if (req.body.buttonClicked == 'saveChallenge')
      {
        
      }
      else if (req.body.buttonClicked == 'saveEntry')
      {
        
      }
      else if (req.body.buttonClicked == 'gotoMain')
      {
        
      }
        res.send();
    });

function handle_get_request(req, res) {

    render_page(req, res, 'index.ejs');
}
function print_id() {
	console.log(challenge_id);
	console.log(challenge_id);
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
app.get('/view', function(req, res) { render_page(req, res, 'pg.ejs')});
app.get('/index', function(req, res) { render_page(req, res, 'index.ejs')});
app.get('/', handle_get_request);
app.post('/', handle_post_request);
app.get('*', function(req, res){
	res.send('404 Sorry! Page is not found :(', 404);
});
