let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
const { v4: uuidv4 } = require('uuid');


var rooms = {}
var users = {}
var sockets = {}


function parse_incoming_data(data){
  return JSON.parse(data);
}


io.on("connection", socket => {
  console.log("User connected on socket " + socket.id);
  socket.emit("user_connection");

  socket.on('user_connection', data => {
    if (data.user_id in users){
      console.log("Warning : multiple connection from single user detected");
      socket.emit('user_duplicated');
    }
    else{
      users[data.user_id] = null;
      sockets[socket.id] = data.user_id;
      socket.emit('confirm_user_connection');
    }
  });

  socket.on("disconnect", function() {

    user_id = sockets[socket.id]
    if (!(user_id in users)){ return }

    console.log("User with id " + user_id +  " disconnected");

    if (user_id in users){
      room_id = users[user_id]

      if (room_id !== null){
        console.log(rooms);
        console.log(room_id);
        console.log(rooms[room_id]);
        rooms[room_id].forEach(element => {
          if (element['user_id'] === user_id) {
            rooms[room_id].splice(rooms[room_id].indexOf(element), 1);
          }
        })
      }
    }
    else { room_id = undefined; }

    delete users[user_id]

    io.emit("user_disconnection", {
      room_id: room_id,
      user_id: user_id,
      users: rooms[room_id]
    });

    if (rooms[room_id] === undefined) { delete rooms[room_id]; }

  });
  /*
  socket.on("user_disconnection", data => {
    console.log("User disconnection order received from user " + data.user_id + " on room id " + data.room_id);

    if (rooms[data.room_id] !== undefined) {

      rooms[data.room_id].foreach(element => {
        if (element['user_id'] === data.user_id) {
          rooms[data.room_id].splice(rooms[data.room_id].indexOf(element), 1);
        }
      })

      if (rooms[data.room_id].length <= 0) {
        rooms.splice(rooms.indexOf(data.room_id), 1);
      }

      io.emit("user_disconnection", {
        room_id: data.room_id,
        user_id: data.user_id,
        users: rooms[data.room_id]
      });

    }
  });*/

  socket.on("user_update", data => {
    console.log("User update order received on server : " + data.room_id)
    console.log(rooms)
    console.log(data.room_id)
    console.log(data.user_name)
    rooms[data.room_id].forEach(user => {
      if (user['user_id'] === data.user_id){
        user['user_name'] = data.user_name;
      }
    })
    console.log('--')
    console.log(rooms[data.room_id])
    console.log(data.user_name)
    io.to(data.room_id).emit("update_users", { users: rooms[data.room_id], user_name: data.user_name });
  })

  socket.on("room_creation", data => {
    console.log("Room creation order received on server : " + data.room_id);
    rooms[data.room_id] = [{
      'user_id': data.user_id,
      'user_name': data.user_name
    }];
    users[data.user_id] = data.room_id;
    socket.join(data.room_id);

    io.to(data.room_id).emit("room_creation", {
      room_id: data.room_id,
      room_name: data.room_name,
      user_id: data.user_id,
      user_name: data.user_name
    });
  });

  socket.on("room_connection", data => {
    console.log("Room connection order received on server : " + data.room_id + " from user : " + data.user_id);

    if (data.room_id in rooms){
      rooms[data.room_id].push({
        'user_id': data.user_id,
        'user_name': data.user_name
      })

      users[data.user_id] = data.room_id;
      socket.join(data.room_id);

      socket.emit("room_connection", {
        room_id: data.room_id,
        user_id: data.user_id,
        user_name: data.user_name
      });

      io.to(data.room_id).emit("update_users", { users: rooms[data.room_id], user_name: data.user_name });
    }

    else {

      console.log("No room found with this id. Abort");
      socket.emit("room_unknown", { room_id: data.room_id });

    }
  });
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
