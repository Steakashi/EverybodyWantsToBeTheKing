let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

io.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");

  socket.on("room_creation", room_id => {
    console.log("Room creation order received: " + room_id);
    io.emit("room_creation", {
      action: "room_creation",
      room_id: room_id
    });
  });
});

// Initialize our websocket server on port 5000
http.listen(5000, () => {
  console.log("started on port 5000");
});
