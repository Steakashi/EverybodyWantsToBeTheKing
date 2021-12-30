const { Expedition } = require("./expedition");
const { Heal } = require("./heal");


function initialize_action(action_data){
    switch(action_data.identifier){
       case ("Expedition"):
            return new Expedition(action_data);
        case("Heal"):
            return new Heal(action_data)
    }
}


module.exports = {
    initialize_action: initialize_action,
    //preprocess: preprocess,
    //process: process,
    //PlayerState: PlayerState
  };