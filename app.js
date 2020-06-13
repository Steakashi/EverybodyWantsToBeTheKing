let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
const { v4: uuidv4 } = require('uuid');


var rooms = {}





function parse_incoming_data(data){
  return JSON.parse(data);
}


io.on("connection", socket => {
  console.log("User connected")

  socket.on("user_connexion", data => {
    console.log("User connected with id : " + data.user_id);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");

    socket.emit("disconnection_order", {});
  });

  socket.on("user_disconnection", data => {
    console.log("User disconnection order received from user " + data.user_id + " on room ID " + data.room_id);

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
        action: "user_disconnection",
        room_id: data.room_id,
        user_id: data.user_id,
        users: rooms[data.room_id]
      });

    }
  });

  socket.on("room_creation", data => {
    console.log("Room creation order received on server : " + data.room_id);
    rooms[data.room_id] = [{
      'user_id': data.user_id,
      'user_name': data.user_name
    }]

    io.emit("room_creation", {
      action: "room_creation",
      room_id: data.room_id,
      room_name: data.room_name,
      user_id: data.user_id,
      user_name: data.user_name
    });
  });

  socket.on("room_connexion", data => {
    console.log("Room connexion order received on server : " + data.room_id);

    if (data.room_id in rooms){
      rooms[data.room_id].push({
        'user_id': data.user_id,
        'user_name': data.user_name
      })

      io.emit("room_connexion", {
        action: "room_connexion",
        room_id: data.room_id,
        user_id: data.user_id,
        user_name: data.user_name,
        users: rooms[data.room_id]
      });
    }

    else {

      console.log("No room found with this ID. Abort");
      socket.emit("room_unknown", { room_id: data.room_id });

    }
  });
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
