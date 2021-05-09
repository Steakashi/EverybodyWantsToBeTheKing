const { disconnect } = require("process");
const { BlockScopeAwareRuleWalker } = require("tslint");
const { resolveTripleslashReference } = require("typescript");
const { v4: uuidv4 } = require('uuid');


const { ServerInstance } = require("./server");
const io = require('./server').io;
const http = require('./server').http;
const dataHandler = require('./data');
const cst = require('./constants');


function _is_not_empty(object){
  return (!(Object.keys(object).length === 0 && object.constructor === Object));
}


function begin_round(server){
  console.log("[Room " + server.room.id + "] All players have chosen an action.")
  server.room.delete_interval()
  server.room.delete_turn_end();
  console.log()
  server.emit_to_room(
    "begin_round",
    {
      users: server.room.users,
    }
  );
  server.room.sort_players();
  server.room.process_pile();
}

function begin_turn(server){
  server.room.begin_turn()
  server.room.register_interval(
    setInterval(
      function(){
        server.room.turn_clock--;
        server.emit_to_room(
          "turn_clock",
          {
            clock: server.room.turn_clock
          })
      },1000)
  )
  server.room.register_turn_end(
    setTimeout(
      function(){ begin_round(server); },1000 * cst.TURNTIME)
  )
}

function process_pile(server){
  console.log('process_pile');
  var action = server.room.pile.shift()
  console.log(action)
  if (action !== undefined){ action.process(); }
  else{ 
    console.log("[Room " + server.room.id + "] All players have played. Beginning new round.")
    server.emit_to_room("end_round"); 
    begin_turn(server);
  }
}

io.on("connection", socket => {
  var server = undefined;
  socket.emit('user_connection');

  socket.on('user_connection', data => {
    server = new ServerInstance(socket);
    user = dataHandler.get_user(data.user_id);
    if (user){
      if (user.status == cst.STATUS.DISCONNECTED)
      {
        server = dataHandler.get_server_instance(data.user_id);
        server.socket = socket;
        console.log("User with id " + server.user.id +  " has correctly reconnected");
        server.set_status(cst.STATUS.CONNECTED);
        server.delete_timeout();

        if (server.room !== undefined)
        {
          server.socket.join(server.room.id);
          server.emit_to_user(
            "room_connection",
            {
              room_id: server.room.id,
              room_name: server.room.name,
              user_id: server.user.id,
              user_name: server.user.name
            }
          )
    
          server.emit_to_room(
            "users_update",
            {
              users: server.room.users,
              user_name: server.user.name
            }
          )
        };
      }
      else
      {
        console.log("Warning : multiple connection from single user detected");
        server.emit_to_user('user_duplicated');  
      }
    }
    else{
      dataHandler.instances.push(server);
      server.generate_user(data.user_id);
      console.log("User connected with id " + data.user_id)
      server.set_status(cst.STATUS_CONNECTED);
      server.emit_to_user('user_connection_confirmed');
    }
  });

  socket.on("disconnect", function() {
    console.log("User with id " + server.user.id +  " disconnected. Waiting " + cst.TIMEOUT + "ms for reconnection...");
    server.set_status(cst.STATUS_DISCONNECTED);
    if (server.room !== undefined){
      server.emit_to_room(
        "users_update",
        {
          users: server.room.users,
          user_name: server.user.name
        }
      )
    };

    server.register_timeout(
      setTimeout(function(){ 

        console.log("User with id " + server.user.id + " has not reconnected. Deletion in progress")
        user_id = server.user.id;
  
        if (server.room !== undefined){
          server.room.remove_user(server.user);
          room_id = server.room.id;
          room_users = server.room.users
          if (server.room.users.length === 0){ 
            delete_room(server.room);
            server.delete_room() 
          }
          else
          { 
            server.emit_to_room(
              "user_disconnected",
              {
                room_id: room_id,
                user_id: user_id,
                users: room_users
              }
            );
          }
  
        } else {
          room_id = undefined;
          room_users = [];
        }
  
        user_id = server.user.id
        dataHandler.delete_user(server.user)
  
        console.log("User with id " + server.user.id + " has been successfully deleted")
      }, cst.TIMEOUT)
    );
  
  });

  socket.on("user_update", data => {
    console.log("User update order received on room : " + data.room_id)
    user = dataHandler.get_user(data.user_id);
    user.update_name(data.user_name);
    server.emit_to_room(
      "users_update",
      {
        users: server.room.users,
        user_name: data.user_name
      }
    )
    server.emit_to_user(
      "user_update",
      {user_name: data.user_name}
    )
  })

  socket.on("room_creation", data => {
    console.log("Room creation order received on room : " + data.room_id);
    server.user.update_name(data.user_name);
    server.generate_room(data.room_id, data.room_name);
    server.emit_to_room(
      "users_update",
      {
        users: server.room.users,
        user_name: server.user.name
      }
    )
  });

  socket.on("room_connection", data => {
    console.log("Room connection order received on room : " + data.room_id + " from user : " + data.user_id);

    let room = dataHandler.get_room(data.room_id)
    if (room){
      server.user.update_name(data.user_name);
      server.set_room(room);
      server.join_room();
      server.emit_to_user(
        "room_connection",
        {
          room_id: server.room.id,
          room_name: server.room.name,
          user_id: server.user.id,
          user_name: server.user.name
        }
      );

      server.emit_to_room(
        "users_update",
        {
          users: server.room.users,
          user_name: server.user.name
        }
      );

    }
    else {

      console.log("No room found with this id. Abort");
      server.emit_to_user("room_unknown", { room_id: data.room_id });

    }
  });

  socket.on("game_launch", data => {
    if (server.room.game_master != undefined){ 
     console.log("Game launch order received on room : " + server.room.id + ", but similar order has already been received.")
    }
    else
    {
      console.log("Game launch order received on room : " + server.room.id + " from user : " + server.user.id);
      server.room.game_master = server.user;
      begin_turn(server);
      server.emit_to_room(
        "game_launch", 
        {
          users: server.room.users,
        }
      );
    }
  });

  socket.on("synchronization", data => {
    console.log("[Room " + server.room.id + "] Player with id " + server.user.id + " has synchronized")
    server.user.synchronize_player(data.player, data.action, data.targets);
    if (data.action_processed === true){ process_pile(server); }
    
  });

  socket.on("turn_end", data => {
    console.log("[Room " + server.room.id + "] Player with id " + server.user.id + " has ended his turn")
    server.user.end_turn();
    if (server.room.are_players_ready()){ begin_round(server); }
    else
    {
      server.emit_to_room(
        "users_update",
        {
          users: server.room.users,
        }
      );
    }
  })
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
