var async    = require('async');
var express  = require('express');
var util     = require('util');
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PWD + '@linus.mongohq.com:10039/app11523105');

var _db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
		console.log("yay! successful db connection :D!");
});

var _challenges = mongoose.Collection('challenges',_db);
var _entries = mongoose.Collection('entries',_db);
var _users = mongoose.Collection('users',_db);

_challenges.ensureIndex({ title: 1 }, { unique: true });
_entries.ensureIndex({ title:1, challenge: 1 }, { unique: true });


function getChallenges() {
		return _challenges;
}

function getEntries() {
		return _entries;
}

function getTopPlacer( challenge ) {
		var match = _challenges.findOne({ title: challenge });
		var top = match.entries.find().sort({ maxmetric: -1, minmetric: 1, upvotes:-1 }).limit(1);
		return top;
}

function getChallengeByTitle( inTitle ) {
		var match = _challenges.findOne({ title: inTitle });
		return match;
}

function getChallengeByType( inType ) {
		var match = _challenges.find({ title: inTitle });
		return match;
}

function getChallengeByCreator( creator ) {
		var match = _challenges.find({ user: creator });
		return match;
}

function getEntryByTitle( inTitle ) {
		var match = _entries.find({ title: inTitle });
		return match;
}

function getEntryByCreator( creator ) {
		var match = _entries.find({ user: creator });
		return match;
}

function getEntryByCreator( creator ) {
		var match = _entries.find({ user: creator });
		return match;
}

function findEntries( query ) {
		var match = _entries.find(query);
		return match;
}

function findChallenges( query ) {
		var match = _entries.find(query);
		return match;
}

function createEntry( creator, inTitle, inChallenge, inMetric, inContent ) {
		_entries.insert({ user: creator, title: inTitle, challenge: inChallenge, metric: inMetric, content: inContent });
}

function createChallenge( creator, inTitle, inType, inMinmax ) {
		_challenges.insert({ user: creator, title: inTitle, type: inType, minmax: inMinmax });
}




function getUsers() {
		return _users;
}

function getUserById( inUserId ) {
		var match = _users.find({ userId: inUserId });
		return match;
}
