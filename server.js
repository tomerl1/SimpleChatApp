var
express		= require('express'),
path		= require('path'),
app			= express(),
http		= require('http').Server(app),
io			= require('socket.io')(http),
settings 	= require('./src/settings.js');

app.use(express.static(path.join(__dirname, './www/')));

app.get('/', function(req, res) {
	res.sendFile('./index.html');
})

http.listen(4040, function(){
	console.log('Chat server listening on *:4040');
});

io.on('connection', function(socket){
	socket.chat = {};
	
	socket.on('disconnect', function(){
		leaveRoom(socket);
	});

	socket.on('set-name', function(data) {
		socket.chat.name = data.name;
		console.log('User has set the name: ' + socket.chat.name);
		addToRoom(socket, settings.defaultRoomId);
	});

	socket.on('chat-message', function(text) {
		console.log(socket.chat.name + ': ' + text);
		socket.broadcast.to(socket.chat.room).emit('chat-message', socket.chat.name + ': ' + text)
	});

	socket.on('join-room', function(id){
		socket.leave(socket.chat.room)
		leaveRoom(socket);	
		addToRoom(socket, id);
	});

	console.log('User connected.');
});

function addToRoom(socket, roomId) {
	var roomName = settings.rooms[roomId]
	socket.join(roomName);
	socket.chat.room = roomName;
	var clients = io.sockets.adapter.rooms[roomName];

	var roomsData = [];
	for (var i = 0; i < settings.rooms.length; i++) {
		var clients = io.sockets.adapter.rooms[settings.rooms[i]];
		var count = 0;

		if (clients) {
			count = Object.keys(clients).length;
		}

		roomsData.push({
			id: i,
			name: settings.rooms[i],
			count: count
		});
	};

	socket.emit('set-room', roomId);
	var count =  clients ? Object.keys(clients).length : 0;
	socket.broadcast.to(roomName).emit('user-joined', socket.chat.name);
	io.sockets.emit('update-rooms', roomsData);
}

function leaveRoom(socket) {
	var roomsData = [];
	for (var i = 0; i < settings.rooms.length; i++) {
		var clients = io.sockets.adapter.rooms[settings.rooms[i]];
		var count = 0;

		if (clients) {
			count = Object.keys(clients).length;
		}

		roomsData.push({
			id: i,
			name: settings.rooms[i],
			count: count
		});
	};

	socket.broadcast.to(socket.chat.room).emit('user-left', socket.chat.name);
	io.sockets.emit('update-rooms', roomsData);
}