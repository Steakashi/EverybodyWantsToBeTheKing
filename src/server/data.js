var instances = []
var instances_number = 0
var rooms = []
var rooms_number = 0
var users = []
var users_number = 0

function _generate_id(suffix, number){
  console.log(number)
  formatted_name = suffix + number.toString();
  number += 1;
  return formatted_name;

}

function generate_user_id(){
  console.log(users_number)
  return _generate_id("USER", users_number);
}

function get_server_instance(user_id){
  var instance_found = null;
  instances.forEach(element => {
    if (element.user.id === user_id) {
      instance_found = element;
    }
  });
  return instance_found;
}

function get_room(room_id){
  var room_found = null;
  rooms.forEach(room => {
    if (room.id === room_id){ room_found = room; }
  })
  return room_found;
}

function get_user(id){
  var user_found = null;
  users.forEach(element => {
    if (element.id === id) {
      user_found = element;
    }
  });
  return user_found;
}

function delete_room(room){
  rooms.forEach(element => {
    if (element === room) {
      rooms.splice(rooms.indexOf(element), 1);
    }
  });
}

function delete_user(user){
  users.forEach(element => {
    if (element === user) {
      users.splice(users.indexOf(element), 1);
    }
  });
}

module.exports = {
  instances: instances,
  rooms: rooms,
  users: users,
  generate_user_id: generate_user_id,
  get_server_instance: get_server_instance,
  get_room: get_room,
  get_user: get_user,
  delete_room: delete_room,
  delete_user: delete_user
};
  