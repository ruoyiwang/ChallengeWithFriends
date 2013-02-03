var async    = require('async');
var express  = require('express');
var events   = require('events');
var util     = require('util');
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

app.dynamicHelpers({
  'host': function(req, res) {
    return req.headers['host'];
  },
  'scheme': function(req, res) {
    req.headers['x-forwarded-proto'] || 'http'
  },
  'url': function(req, res) {
    return function(path) {
      return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
    }
  },
  'url_no_scheme': function(req, res) {
    return function(path) {
      return '://' + app.dynamicViewHelpers.host(req, res) + path;
    }
  },
});

function render_page(req, res, pgPath) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render(pgPath, {
        layout:    false,
        req:       req,
        app:       app,
        user:      user
      });
    });
  });
}

function handle_request(req, res) {
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
      var POST = qs.parse(body);
      
    });
   }
 }

function handle_facebook_request(req, res) {

  // if the user is logged in
  if (req.facebook.token) {

    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
          req.friends = friends;
          cb();
        });
      },
      function(cb) {
        // query 16 photos and send them to the socket for this socket id
        req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
          req.photos = photos;
          cb();
        });
      },
      function(cb) {
        // query 4 likes and send them to the socket for this socket id
        req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
          req.likes = likes;
          cb();
        });
      },
      function(cb) {
        // use fql to get a list of my friends that are using this app
        req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
          req.friends_using_app = result;
          cb();
        });
      }
    ], function() {
      render_page(req, res, 'index.ejs');
    });

  } else {
    render_page(req, res, 'index.ejs');
  }
  render_page(req, res);
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
app.get('/', handle_facebook_request);
app.post('/', handle_facebook_request);
app.get('*', function(req, res){
	res.send('404 Sorry! Page is not found :(', 404);
});
