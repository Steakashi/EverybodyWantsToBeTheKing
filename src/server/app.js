const { disconnect } = require("process");
const { BlockScopeAwareRuleWalker } = require("tslint");
const { resolveTripleslashReference } = require("typescript");
const { v4: uuidv4 } = require('uuid');


const { ServerInstance } = require("./server");
const { PileHandler } = require("./pile");
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
  server.emit_to_room(
    "begin_round",
    {
      users: server.room.users,
    }
  );
  server.room.pile.sort();
  server.room.pile.process()
  //server.room.process_pile();
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

// Todo : remove
function process_pile(server){
  var action = server.room.pile.shift()
  if (action !== undefined){ action.process(); }
  else{ 
    console.log("[Room " + server.room.id + "] All players have played. Beginning new round.")
    server.emit_to_room("end_round"); 
    begin_turn(server);
  }
}

io.on("connection", socket => {
  var server = undefined;
  
  // Automatically send a signal to tell client that server is up
  socket.emit('user_connection');

  // If same signal is received, then client is up too : let's create a ServerInstance and connect the user to it.
  socket.on('user_connection', data => {
    server = new ServerInstance(socket);
    user = dataHandler.get_user(data.user_id);

    // If user is already found, it means client is already connected.
    // If user has DISCONNECTED status, we consider that client has recently disconnected by mistake, and so we reconnect him to server.
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
          server.emit_room_connection();
    
          server.emit_users_update();
        };
      }
      
      // If another status is retrieved, then we consider that the user try to connect to the app through another tab.
      // In this case we abort loading.
      // The utility of this process was that the client can reconnect from any tab whenever he needs. 
      // But it may be not necessary since the inclusion of the reconnection module through user status.
      else
      {
        console.log("Warning : multiple connection from single user detected");
        server.emit_to_user('user_duplicated');  
      }
    }

    // If no user is found, we deal with a first connexion with a client, and therefore create all the things we need to generate all necessary data and acknowledge user connection.
    else{
      dataHandler.instances.push(server);
      server.generate_user(data.user_id);
      console.log("User connected with id " + server.user.id)
      server.set_status(cst.STATUS.CONNECTED);
      server.emit_to_user('user_connection_confirmed');
    }
  });

  socket.on("disconnect", function() {
    console.log("User with id " + server.user.id +  " disconnected. Waiting " + cst.TIMEOUT + "ms for reconnection...");
    server.set_status(cst.STATUS.DISCONNECTED);
    if (server.room !== undefined){
      server.emit_users_update();
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
    server.emit_users_update();
    server.emit_to_user(
      "user_update",
      {user_name: data.user_name}
    )

  })

  socket.on("room_creation", data => {
    console.log("Room creation order received on room : " + data.room_id);
    server.user.update_name(data.user_name);
    server.generate_room(data.room_id, data.room_name);
    server.emit_users_update();
  });

  socket.on("room_connection", data => {
    console.log("Room connection order received on room : " + data.room_id + " from user : " + data.user_id);
    let room = dataHandler.get_room(data.room_id)
    if (room){
      server.user.update_name(data.user_name);
      server.set_room(room);
      server.join_room();
      server.emit_room_connection();

      server.emit_users_update();

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
      server.room.pile = new PileHandler(server);
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
    server.user.synchronize_player(data.player);

    //if (data.action_processed === true){ process_pile(server); }
    
  });

  socket.on("turn_end", data => {
    console.log("[Room " + server.room.id + "] Player with id " + server.user.id + " has ended his turn")
    server.room.pile.add(data.action);
    server.user.end_turn();
    if (server.room.are_players_ready()){ begin_round(server); }
    else
    {
      server.emit_users_update();
    }
  })

  socket.on("action_state_processed", data => {
    server.room.pile.process()
  })
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
