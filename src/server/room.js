const cst = require('./constants');

class Room{
    id;
    name;
    users;
    game_master;
    interval;
    turn_clock;
    turn_end;
    pile;
  
    constructor(id, name){
      this.id = id;
      this.name = name;
      this.users = [];
      this.game_master = undefined;
    }
  
    add_user(user){
      user.room_id = this.id;
      this.users.push(user)
    }
  
    remove_user(user){
      this.users.forEach(element => {
        if (element === user) {
          this.users.splice(this.users.indexOf(element), 1);
        }
      });
    }
  
    begin_turn(){
      this.users.forEach(user => {
        user.begin_turn();
      });
    }
  
    end_turn(){
      this.users.forEach(user => {
        user.end_turn();
      });
    }
  
    are_players_ready(){
      for(var i = 0; i < this.users.length; i++) {
        if (this.users[i].status === cst.STATUS.PLAYING) {
          return false;
        };
      };
      return true;
    }
  
    register_turn_end(turn_end){
      this.turn_end = turn_end;
    }
  
    register_interval(interval){
      this.turn_clock = cst.TURNTIME;
      this.interval = interval;
    }
  
    delete_turn_end(){
      clearTimeout(this.turn_end);
    }
  
    delete_interval(){
      clearInterval(this.interval);
    }
  
    // Todo : Remove
    sort_players(){
      this.pile = this.users.map((x) => x);
      this.pile.sort((p1, p2) => (p1.agility >= p2.agility) ? 1 : -1);
    }
  
  }

module.exports = { Room };