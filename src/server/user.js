const cst = require('./constants');
const dataHandler = require('./data');

class User{

    id;
    name;
    status;
    popularity;
    agility;
    golds;
    room_id;
    socket_id;
  
    constructor(id, name){
      this.id = id;
      this.name = name;
      this.status = cst.STATUS.UNKNOWN;
    }
  
    synchronize_player(player){
      this.popularity = player.popularity;
      this.agility = player.agility;
      this.golds = player.golds;
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
  
    //Todo : remove
    process(){
      console.log("[Room " + this.room_id + "] Player with id " + this.id + " is now playing")
      dataHandler.get_server_instance(this.targets.shift()).emit_to_user('play', this.action);
    }
  
  }

  module.exports = { User };