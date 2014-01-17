
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');

var http = require('http');
var server = http.createServer(app);
var path = require('path');
var io = require('socket.io').listen(server);
var colors = {};

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(client) {
	console.log('New connection from: ' + client.handshake.address.address);

	client.emit('loadColors', colors);

	client.on('changeColor', function(data){
		colors[data.x+'x'+data.y] = data.color;
		client.broadcast.emit('changeColor', data);
	});
});