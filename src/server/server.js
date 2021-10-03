let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

const { Room } = require("./room");
const { User } = require("./user");

const dataHandler = require("./data");

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

    emit_users_update(){
      this.emit_to_room(
        "users_update",
        {
          users: this.room.users
        }
      )
    }

    emit_players_update(){
      this.emit_to_room(
        "players_update",
        {
          players: this.room.users
        }
      )
    }

    emit_room_connection(){
      this.emit_to_room(
        "room_connection",
        {
          room_id: this.room.id,
          room_name: this.room.name,
        }
      )
    }
  
    generate_user(user_id){
      this.user = new User(user_id);
      dataHandler.users.push(this.user);
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
      this.timeout = timeout;
    }
  
    delete_timeout(){
      clearTimeout(this.timeout);
    }
  
    generate_room(room_id, room_name){
      this.room = new Room(room_id, room_name);
      this.room.add_user(this.user);
      this.socket.join(room_id);
      dataHandler.rooms.push(this.room);
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

module.exports = { 
  ServerInstance: ServerInstance, 
  io: io,
  http: http
}; 