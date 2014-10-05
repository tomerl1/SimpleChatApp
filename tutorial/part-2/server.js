var
express		= require('express'),
app			= express(),
http		= require('http').Server(app),
path		= require('path'),
io			= require('socket.io')(http);

/* Set a static folder for our files */
app.use(express.static(path.join(__dirname, './www/')));

/* Send the default html file to client */
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

/* Start listening on port 4040 */
http.listen(4040, function(){
	console.log('Chat server listening on *:4040');
});

io.on('connection', function(socket){
	console.log('A user has connected.')

	io.on('disconnect', function(socket){
		console.log('A user has disconnected.')
	});
});