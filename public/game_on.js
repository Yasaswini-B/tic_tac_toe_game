socket = io.connect();
winning_possibilities =[[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
images_url = {
  1:"url(tic_cross.png)", 
  2:"url(tic_round.png)"
}

var Client ={
  count: 1,
  player_turn: 1,
  curent_player: 0,
  game_status: document.getElementById("status"),
  ticvar: document.getElementsByName("tic_tac"),
  error_status: document.getElementById("error"),
  name_board: document.getElementById("player_name"),
  room_name: "",


  initialize: function(){
    this.tic_tac_game_on();
    this.sockets_on();

  },

  tic_tac_game_on: function(){
      document.getElementById("input_name").addEventListener("click",function (){
      socket.emit('player name', document.getElementById("name").value);
    });
  },
  game_start: function(){
    var func = this.change_char;
    var c_obj = this;
    for(var i=0; i<this.ticvar.length; i++){
        if(this.count <= 9){
        this.ticvar[i].addEventListener("click",function() { func(event, c_obj);});
      }
    }
  },

  change_char: function (e, c_obj){
    var cell_object = document.getElementById(e.target.id);
    if(c_obj.count <= 9){
      if(c_obj.player_turn == c_obj.curent_player){
        if(cell_object.value === 1 || cell_object.value === 2){
          err_msg = "This cell is filled, please try in other cell!"; 
        }else{
          socket.emit('box click', cell_object.id, c_obj.room_name);
          err_msg = "";
        }
      }else{
        err_msg = "This is player "+c_obj.player_turn+"'s turn...please wait!";
      }
    }else{
      err_msg = "Game over";
    } 
    c_obj.error_status.innerHTML = err_msg;
  },

  check_status: function (element_id, player_num){
    var check_value = parseInt(element_id.charAt(element_id.length-1));
    var check_win;
    var result = 0;
    for(var i=0; i < winning_possibilities.length; i++){
      if(winning_possibilities[i].indexOf(check_value) != -1){
        check_win = 0;
        for(var j=0; j < winning_possibilities[i].length; j++){
          var element_id = "tic_tac"+winning_possibilities[i][j];
          var element_value = document.getElementById(element_id).value;
          if(element_value == player_num){
            check_win++;
            if(check_win == 3){
              result = winning_possibilities[i];
            }
          }          
        }
      }
    }
    return result;
  },

  sockets_on: function(){
    c_obj = this;

    socket.on('new object', function (element_id, player_num, room_name){
      var new_object = document.getElementById(element_id);
      var status = "";
      new_object.style.backgroundImage=images_url[player_num];
      c_obj.player_turn = (player_num == 1) ? 2 : 1;
      new_object.value = player_num;
      c_obj.count ++; 

      c_obj.error_status.innerHTML = status;

      if(4 < c_obj.count){
        var result = c_obj.check_status(element_id,player_num);
        
        if(result.length === 3){
          for(var i=0; i < result.length; i++){
            var element = document.getElementById("tic_tac"+result[i]);
            element.style.backgroundColor = "yellow";
          }
          status ="Player "+player_num+" win!";
          c_obj.count = 10;
        }else if(result === 0 && c_obj.count > 9){
          status ="Game over..Tie up";
          c_obj.count = 10;
        }
      }

      c_obj.game_status.innerHTML = status; 
    });

    socket.on('single player', function(message, r_name, game){
      c_obj.game_status.innerHTML = message;
      c_obj.room_name = r_name;
      if(game){
        c_obj.game_start();
      }
    });

    socket.on('new player', function(name, player_num){
      c_obj.name_board.innerHTML = name+"'s game";
      c_obj.curent_player = player_num;
    });
  }  
}

Client.initialize();
