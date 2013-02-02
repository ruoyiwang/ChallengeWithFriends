var async    = require('async');
var express  = require('express');
var events   = require('events');
var util     = require('util');
var mongoose = require('mongoose');
var Dbaccess = require('./dbaccess').dbAccessor;
var qs       = require('querystring');

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

function render_page(req, res) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render('index.ejs', {
        layout:    false,
        req:       req,
        app:       app,
        user:      user
      });
    });
  });
}

function render_page2(req, res) {
  console.log("in render_page2");
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render('pg.ejs', {
        layout:    false,
        req:       req,
        app:       app,
        user:      user
      });
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
      
    });
  }
  render_page(req, res);
}



app.get('/view', render_page2);
app.get('/', handle_request);
app.post('/', handle_request);
