var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Player = require('/Users/user/Desktop/tic_tac_toe_game/public/player.js');
sid_array = {};
var msg ;
var player_counter = 1;
var room_count = 1;
var room = [];

for(i=1;i<20;i++)
{
  room[i] = "room"+i;
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendfile('tic_tac_toe.html');
});

io.on('connection', function(socket){
	socket.on('player name',function(player_name){
		console.log('a user connected');

		var player = new Player();
		player.initialize(player_counter, socket, player_name);
		sid_array[socket.id] = player;

		socket.emit('new player', player_name, player_counter);

		var players =Object.keys(sid_array);
		if(players.length >= 1){
			socket.join(room[room_count]);
			msg = "Waiting for the 2nd player";
			io.to(room[room_count]).emit('single player', msg, room[room_count], false);
			if(players.length % 2 == 0){
				msg = "Game Started";
				socket.join(room[room_count]);
				io.to(room[room_count]).emit('single player', msg, room[room_count], true);
				room_count++;
				player_counter = 0;
			}
		}
		player_counter++;
	});
	
	socket.on('box click', function(data, room_n){
		io.to(room_n).emit('new object', data, sid_array[socket.id].player_num, room_n );
	});

	socket.on('disconnect', function(){
		if (!socket.id) return;
		var players =Object.keys(sid_array);
		if(players.indexOf(socket.id) != -1){
			console.log('a user disconnected');
			delete sid_array[socket.id];
		}
	});
  
});




http.listen(3000, function (){
  console.log('listening on *:3000');
});