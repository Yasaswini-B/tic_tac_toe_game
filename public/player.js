function Player(){
	this.player_name;
	this.socket_id;
	this.socket;
	this.player_num;
	this.initialize = function(count, socket, name){
		this.player_name = name;
		this.socket = socket;
		this.socket_id = socket.id;
		this.player_num = count;
	}
	
}


module.exports = Player;