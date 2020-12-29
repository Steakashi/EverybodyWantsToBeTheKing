let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
const { disconnect } = require("process");
const { BlockScopeAwareRuleWalker } = require("tslint");
const { resolveTripleslashReference } = require("typescript");
const { v4: uuidv4 } = require('uuid');


var instances = []
var rooms = []
var users = []


const TIMEOUT = 3000;
const STATUS_UNKNOWN = "unknown"
const STATUS_CONNECTED = "connected"
const STATUS_DISCONNECTED = "disconnected"


function _is_not_empty(object){
  return (!(Object.keys(object).length === 0 && object.constructor === Object));
}

function get_server_instance(id){
  var instance_found = null;
  instances.forEach(element => {
    if (element.user.id === id) {
      instance_found = element;
    }
  });
  return instance_found;
}

function get_room(room_id){
  var room_found = null;
  rooms.forEach(room => {
    if (room.id === room_id){ console.log(room); room_found = room; }
  })
  return room_found;
}

function get_user(id){
  /*
  if (id in users){ return users[id]; }
  else { return null; }
  */
 var user_found = null;
  users.forEach(element => {
    if (element.id === id) {
      user_found = element;
    }
  });
  return user_found;
}

function delete_user(user){
  users.forEach(element => {
    if (element === user) {
      users.splice(users.indexOf(element), 1);
    }
  });
}

function delete_room(room){
  rooms.forEach(element => {
    if (element === room) {
      rooms.splice(rooms.indexOf(element), 1);
    }
  });
}


class ServerInstance{
  socket;
  user;
  room;
  status;
  timeout;

  constructor(socket) {
    this.socket = socket;
    console.log("Socket generated with id " + socket.id);
  }

  emit(event_name, data={}){
    io.emit(event_name, data);
  }

  emit_to_user(event_name, data={}){
    this.socket.emit(event_name, data);
  }

  emit_to_room(event_name, data={}){
    io.to(this.room.id).emit(event_name, data);
  }

  generate_user(user_id){
    this.user = new User(user_id);
    users.push(this.user);
  }

  set_status(status){
    this.user.status = status
  }

  set_room(room){
    this.room = room
  }

  join_room(){
    this.room.add_user(this.user);
    this.socket.join(this.room.id);
  }

  delete_room(){
    delete this.room;
  }

  register_timeout(timeout){
    this.timeout = timeout
  }

  delete_timeout(){
    clearTimeout(this.timeout)
  }

  generate_room(room_id, room_name){
    this.room = new Room(room_id, room_name);
    this.room.add_user(this.user);
    this.socket.join(room_id);
    rooms.push(this.room);
    this.emit_to_room(
      'room_creation',
      {
        room_id: this.room.id,
        room_name: this.room.name,
        user_id: this.user.id,
        user_name: this.user.name
      }
    )
  }
}

class User{

  constructor(id, name=""){
    this.id = id;
    this.name = name;
    this.status = STATUS_UNKNOWN;
  }

  update_name(name){
    this.name = name;
  }

}

class Room{
  id;
  name;
  users;

  constructor(id, name){
    this.id = id;
    this.name = name;
    this.users = [];
  }

  add_user(user){
    this.users.push(user)
  }

  remove_user(user){
    this.users.forEach(element => {
      if (element === user) {
        this.users.splice(this.users.indexOf(element), 1);
      }
    });
  }

}


io.on("connection", socket => {
  var server = undefined;
  socket.emit('user_connection');

  socket.on('user_connection', data => {
    server = new ServerInstance(socket);
    user = get_user(data.user_id)
    if (user){
      if (user.status == STATUS_DISCONNECTED)
      {
        server = get_server_instance(data.user_id);
        server.socket = socket;
        console.log("User with id " + server.user.id +  " has correctly reconnected");
        server.set_status(STATUS_CONNECTED);
        server.socket.join(server.room.id);
        server.delete_timeout();
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
      }
      else
      {
        console.log("Warning : multiple connection from single user detected");
        server.emit_to_user('user_duplicated');  
      }
    }
    else{
      instances.push(server);
      server.generate_user(data.user_id);
      console.log("User connected with id " + data.user_id)
      server.set_status(STATUS_CONNECTED);
      server.emit_to_user('user_connection_confirmed');
    }
  });

  socket.on("disconnect", function() {
    console.log("User with id " + server.user.id +  " disconnected. Waiting " + TIMEOUT + "ms for reconnection...");
    server.set_status(STATUS_DISCONNECTED);
    server.emit_to_room(
      "users_update",
      {
        users: server.room.users,
        user_name: server.user.name
      }
    );

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
        delete_user(server.user)
  
        console.log("User with id " + server.user.id + " has been successfully deleted")
      }, TIMEOUT)
    );
  
  });

  socket.on("user_update", data => {
    console.log("User update order received on server : " + data.room_id)
    user = get_user(data.user_id);
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
    console.log("Room creation order received on server : " + data.room_id);
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
    console.log("Room connection order received on server : " + data.room_id + " from user : " + data.user_id);

    let room = get_room(data.room_id)
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
      )

      server.emit_to_room(
        "users_update",
        {
          users: server.room.users,
          user_name: server.user.name
        }
      )

    }
    else {

      console.log("No room found with this id. Abort");
      server.emit_to_user("room_unknown", { room_id: data.room_id });

    }
  });
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
