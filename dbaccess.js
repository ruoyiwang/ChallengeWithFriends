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
		//eventer.createChallenge('123','this is a challenge.', 'some Type', 'min');
});

dbAccessor.prototype._db = _db;

dbAccessor.prototype.getChallenges = function(callback) {
	this._challenges.find({},function(err,cursor){
		cursor.toArray(function(err,list)
		{
			console.log(list);
			callback(list);
		});
	});
};

dbAccessor.prototype.getEntries = function(callback) {
	this._entries.find({},function(err,cursor){
		cursor.toArray(function(err,list)
		{
			callback(list);
		});
	});
};

dbAccessor.prototype.getTopPlacer = function( challenge, callback ) {
		var match = this._challenges.findOne({ title: challenge });
		var top = match.entries.find({},function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		}).sort({ upvotes:-1 }).limit(1);
		callback(top);
};

dbAccessor.prototype.getChallengeByTitle = function( inTitle, callback ) {
		var match = this._challenges.findOne({ title: inTitle },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

dbAccessor.prototype.getChallengesByType = function( inType, callback ) {
		var match = this._challenges.find({ type: inType },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

dbAccessor.prototype.getChallengesByCreator = function( creator, callback ) {
		var match = this._challenges.find({ user: creator },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

dbAccessor.prototype.getEntriesByCreator = function( creator, callback ) {
		var match = this._entries.find({ user: creator },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

dbAccessor.prototype.getEntriesByChallenge = function( inChallenge, callback ) {
		var match = this._entries.find({ challenge: inChallenge },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

dbAccessor.prototype.createEntry = function( creator, inTitle, inChallenge, inContent, callback ) {
		this._entries.save({ user: creator, title: inTitle, challenge: inChallenge, metric: 0, content: inContent }, { safe: true }, callback);
};

dbAccessor.prototype.upvote = function( entry, callback ) {
		this._entries.save({ user: entry.user, title: entry.title, challenge: entry.challenge, metric: entry.metric+1, content: entry.content }, { safe: true }, callback);
};

dbAccessor.prototype.createChallenge = function( creator, inTitle, callback ) {
		console.log(inTitle)
		this._challenges.save({ user: creator, title: inTitle }, { safe: true }, callback);
};


dbAccessor.prototype.getUsers = function( callback ) {
		this._users.find({},function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
													 console.log(list);
											 });
		});
};

dbAccessor.prototype.getUserById = function( inUserId, callback ) {
		var match = this._users.find({ userId: inUserId },function(err,cursor){
				cursor.toArray(function(err,list)
											 {
													 callback(list);
											 });
		});
};

exports.dbAccessor = dbAccessor;
