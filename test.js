var events = require('events');
var util = require('util');
var Dbaccess = require('./dbaccess').dbAccessor;

var dbaccess= new Dbaccess();
/*
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

eventer.createChallenge('123','this is a challenge.', 'some Type', 'min');*/