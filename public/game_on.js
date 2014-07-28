
var socket = io.connect();
var count=1;
var status = "";
var winning_possibilities =[[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
var images_url = ["tic_cross.png", "tic_round.png"];


function tic_tac_game_on(){
  var ticvar = document.getElementById("tic_tac_table");
  for(var i=0; i<ticvar.rows.length; i++){
    for(var j=0; j<ticvar.rows[i].cells.length; j++){
      if(count <= 9){
      ticvar.rows[i].cells[j].addEventListener("click",changeChar);
      }
    }
  }
}

function changeChar(){
    socket.emit('box click', this.id);
}

socket.on('new object', function (player_game){

  var game_status = document.getElementById("status");
  var object_id = player_game['object_id'];
  var player_num = player_game['player_num'];
  var new_object = document.getElementById(object_id);
  if(count <= 9){
    if(new_object.value == 1 || new_object.value == 2){
      err_msg = "filled";
      socket.emit('error message', err_msg, count); 
      count--;
    }else{
      var myimg = document.createElement("INPUT");
      myimg.setAttribute("type", "image");
      myimg.style.height = "inherit";
      myimg.style.width = "inherit";
      if((count % 2 != 0 && player_num == 1) || (count % 2 == 0 && player_num == 2)){
        myimg.setAttribute("src", images_url[parseInt(player_num) - 1]);
        new_object.appendChild(myimg);
        new_object.value = player_num;
        socket.emit('error message', "clear", count); 
      }else{
        err_msg = "wrong player";
        socket.emit('error message', err_msg, count); 
        console.log("hi");
        count--;
      }
    }

    if(4 < count && count <= 9){
      var result = check_status(object_id,player_num);
          if(result.length == 3){
            for(var i=0; i < result.length; i++){
              var element_id = "tic_tac"+result[i];
              var element = document.getElementById(element_id);
              element.style.backgroundColor = "yellow";
            }
            status ="Player "+player_num+" win!";
            count = 10;
          }else if(result == 0 && count == 9){
            status ="Game over..Tie up";
            count = 10;
          }
          }
          count++;
  }else{
    err_msg = "game over";
    socket.emit('error message', err_msg, count);
  }  

  game_status.innerHTML = status;

});


function check_status(element_id, player_num){
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
}

socket.on('error msg display', function(msg){
          console.log("hello");

  var error_status = document.getElementById("error");
  error_status.innerHTML = msg;
});


socket.on('single player', function(message){
  var game_status = document.getElementById("status");
  game_status.innerHTML = message;
});


