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

    socket.emit("user_disconnection", {
      action: "user_disconnection"
    });
  });

  socket.on("room_creation", data => {
    console.log("Room creation order received on server : " + data.room_id);
    rooms[data.room_id] = [data.user_id];

    console.log(rooms);
    console.log(data);
    console.log(data.room_name);
    socket.emit("room_creation", {
      action: "room_creation",
      room_id: data.room_id,
      room_name: data.room_name,
      users: [data.user_id],
    });
  });
});


// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
