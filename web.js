var async    = require('async');
var express  = require('express');
var events   = require('events');
var util     = require('util');
var Dbaccess = require('./dbaccess').dbAccessor;
var qs       = require('querystring');
var url = require('url');
var path = require('path');

var challenge_id = -1;

var dbaccess= new Dbaccess();
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


function render_page(req, res, pgPath) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render(pgPath, option);
    });
  });
}

function handle_index_post_request(req, res) {
  dbaccess.findEntriesBychallenge(null, function(match)
  {
    render_page(req,res,'challenge.html', {});
  });
}

function handle_get_request(req, res) {
  if (req.method == "GET")
  {
    dbaccess.insert(null, function(match)
    {
      render_page(req, res, 'index.html', match);
    });
  }

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
app.get('/index', handle_get_request);
app.post('/index', handle_index_post_request);
app.get('/', handle_get_request);
app.post('/', handle_post_request);
app.get('*', function(req, res){
	res.send('404 Sorry! Page is not found :(', 404);
});
