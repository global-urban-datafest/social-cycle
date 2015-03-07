'use strict';

/**
 * Module dependencies
 */

var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
    //methodOverride = require('method-override'),
	errorHandler = require('errorhandler'),
	logger = require('morgan'),
	http = require('http'),
	path = require('path');

var RED = require('node-red');

var config = {
	mongodb: {
		databaseName: 'social-cycle'
	},
	port: 3000,
	env: 'development'
};

mongoose.connect('mongodb://localhost/' + config.mongodb.databaseName);

var app = module.exports = express();

// all environments
app.set('port', config.port);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

console.log('env', config.env);

// development only
if (config.env === 'development') {
	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use(errorHandler());
}

// production only
if (config.env === 'production') {
	// TODO
}

/**
 * Routes
 */


/**
 * Start Server
 */
/*module.exports = function() {}*/
var server = http.createServer(app);

/**
 *  Node Red
 */

var redSettings = {
	httpAdminRoot: '/red',
	httpNodeRoot: '/api',
	userDir: __dirname + '/nodered/',
	functionGlobalContext: {}    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server, redSettings);

// Serve the editor UI from /red
app.use(redSettings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(redSettings.httpNodeRoot, RED.httpNode);

server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
RED.start();