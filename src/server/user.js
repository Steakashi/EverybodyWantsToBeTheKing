const cst = require('./constants');
const dataHandler = require('./data');

class User{

    id;
    name;
    status;
    popularity;
    agility;
    action;
    targets;
    room_id;
    socket_id;
  
    constructor(id, name){
      this.id = id;
      this.name = name;
      this.status = cst.STATUS.UNKNOWN;
      this.player = {};
    }
  
    synchronize_player(player, action, targets){
      this.popularity = player.popularity;
      this.agility = player.agility;
      this.action = action;
      this.targets = targets;
    }
  
    update_name(name){
      this.name = name;
    }
  
    begin_turn(){
      this.status = cst.STATUS.PLAYING;
    }
  
    end_turn(){
      this.status = cst.STATUS.READY;
    }
  
    process(){
      console.log("[Room " + this.room_id + "] Player with id " + this.id + " is now playing")
      dataHandler.get_server_instance(this.targets.shift()).emit_to_user('play', this.action);
    }
  
  }

  module.exports = { User };