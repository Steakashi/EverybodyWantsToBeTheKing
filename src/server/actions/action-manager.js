const { Expedition } = require("./expedition");
const { Heal } = require("./heal");


class PlayerState{
    name;
    duration;

    constructor(name, duration){
        this.name = name;
        this.duration = duration;
    }

    consume(){
        this.duration--;
        if (!(this.duration)){ delete this; }
    }
    
}


function initialize_action(action_data){
    switch(action_data.identifier){
       case ("Expedition"):
            return new Expedition(action_data);
        case("Heal"):
            return new Heal(action_data)
    }
}


function preprocess(emitter){
    emitter.states.foreach(state => {
        state.consume();
    })
}


module.exports = {
    initialize_action: initialize_action,
    preprocess: preprocess,
    process: process,
    PlayerState: PlayerState
  };