var async    = require('async');
var express  = require('express');
var util     = require('util');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOHQ_URL);

dbAccessor = function(){};
var _db = mongoose.connection;
_db.on('error', function (err) {
		console.log(err);
});
_db.once('open', function callback () {
		console.log("yay! successful db connection :D!");
		dbAccessor.prototype._challenges = _db.collection('challenges');
		dbAccessor.prototype._entries = _db.collection('entries');
		dbAccessor.prototype._users = _db.collection('users');
		//dbAccessor.prototype._challenges.ensureIndex({ title: 1 }, { unique: true });
		//dbAccessor.prototype._entries.ensureIndex({ title:1, challenge: 1 }, { unique: true });
		//eventer.createChallenge('123','this is a challenge.', 'some Type', 'min');
		dbAccessor.prototype.createChallenge('S','W','A','G');
});

dbAccessor.prototype._db = _db;

dbAccessor.prototype.getChallenges = function(callback) {
		callback(this._challenges);
};

dbAccessor.prototype.getEntries = function(callback) {
		callback(this._entries);
};

dbAccessor.prototype.getTopPlacer = function( challenge, callback ) {
		var match = this._challenges.findOne({ title: challenge });
		var top = match.entries.find().sort({ maxmetric: -1, minmetric: 1, upvotes:-1 }).limit(1);
		callback(top);
};

dbAccessor.prototype.getChallengeByTitle = function( inTitle, callback ) {
		var match = this._challenges.findOne({ title: inTitle });
		callback(match);
};

dbAccessor.prototype.getChallengeByType = function( inType, callback ) {
		var match = this._challenges.find({ title: inTitle });
		callback(match);
};

dbAccessor.prototype.getChallengeByCreator = function( creator, callback ) {
		var match = this._challenges.find({ user: creator });
		callback(match);
};

dbAccessor.prototype.getEntryByTitle = function( inTitle, callback ) {
		var match = this._entries.find({ title: inTitle });
		callback(match);
};

dbAccessor.prototype.getEntryByCreator = function( creator, callback ) {
		var match = this._entries.find({ user: creator });
		callback(match);
};

dbAccessor.prototype.getEntryByCreator = function( creator, callback ) {
		var match = this._entries.find({ user: creator });
		callback(match);
};

dbAccessor.prototype.findEntries = function( query, callback ) {
		var match = this._entries.find(query);
		callback(match);
};

dbAccessor.prototype.findChallenges = function( query, callback ) {
		var match = this._entries.find(query);
		callback(match);
};

dbAccessor.prototype.createEntry = function( creator, inTitle, inChallenge, inMetric, inContent, callback ) {
		this._entries.insert({ user: creator, title: inTitle, challenge: inChallenge, metric: inMetric, content: inContent }, { safe: true }, callback(err, records));
};

dbAccessor.prototype.createChallenge = function( creator, inTitle, inType, inMinmax, callback ) {
		this._challenges.save({ user: creator, title: inTitle, type: inType, minmax: inMinmax }, { safe: true }, callback(err, records));
};


dbAccessor.prototype.getUsers = function( callback ) {
		callback(this._users);
};

dbAccessor.prototype.getUserById = function( inUserId, callback ) {
		var match = this._users.find({ userId: inUserId });
		callback(match);
};

exports.dbAccessor = dbAccessor;
