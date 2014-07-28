var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
sid_array = {};
var msg ;


play_game = {};


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendfile('tic_tac_toe.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	sid_array[socket.id] = socket;
	var players =Object.keys(sid_array);

	if(players.length == 1){
		msg = "Waiting for the 2nd player";
		show_table = false;
		io.emit('single player', msg);
	}else if(players.length == 2){
		msg = "Game Started";
		show_table = true;
		io.emit('single player', msg);
	}else{
		msg = "Game Started between two players..please wait!";
		show_table = true;
		for(var i=2; i < players.length; i++){
			console.log(players[i]);
			sid_array[players[i]].emit('single player', msg);
		}
		
	}

	socket.on('disconnect', function(){
		if (!socket.id) return;
		console.log('a user disconnected');
		var players =Object.keys(sid_array);
		if(players.length > 1){
			if(players.indexOf(socket.id) == 0 || players.indexOf(socket.id) == 1){
				msg = "Opponent Left";
				show_table = true;
				i_val = (players.indexOf(socket.id) == 0) ? 1 : 0;
				sid_array[players[i_val]].emit('single player', msg, show_table);
			}
		}
		delete sid_array[socket.id];
	});
  
});

io.on('connection', function(socket){
	socket.on('box click', function(data){
		var players =Object.keys(sid_array);
		var i = players.indexOf(socket.id);
	  		if((players.length >= 2) && (i == 0 || i == 1){
		  		play_game['player_num'] = i+1;
		  		play_game['object_id'] = data;
		  		play_game['game_over'] = false;
		  		player_num = i + 1;
		    	io.emit('new object', play_game);
			}		
	});

	socket.on('error message', function(err_msg, check_val){
		var players =Object.keys(sid_array);
		switch(err_msg){
			case "filled":
				msg = "This cell is filled, please try in other cell!";
				sid_array[socket.id].emit('error msg display', msg);
			break;
			case "wrong player":
				i_val = (check_val % 2 == 0) ? 1 : 0;

				// if(check_val % 2 != 0){
					sid_array[players[check_val % 2]].emit('error msg display', "This is player "+1+"'s turn...please wait!");
					sid_array[players[i_val]].emit('error msg display', "This is your turn!");
				// }
				// if(check_val % 2 == 0){
				// 	sid_array[players[0]].emit('error msg display', "This is player "+2+"'s turn...please wait!");
				// 	sid_array[players[1]].emit('error msg display', "This is your turn!");
				// }
			break;
			case "game over":
				msg = "The game is over..please click play again to start new game!";
				sid_array[socket.id].emit('error msg display', msg);
			break;
			default:
				msg = "";
				sid_array[socket.id].emit('error msg display', msg);
			break;
		}
	});

});


io.emit('some event', { for: 'everyone' });

http.listen(3000, function (){
  console.log('listening on *:3000');
});



