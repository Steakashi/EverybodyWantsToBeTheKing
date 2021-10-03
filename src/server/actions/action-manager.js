const { Expedition } = require("./expedition");


function initialize_action(action_data){
    switch(action_data.identifier){
       case ("Expedition"):
           return new Expedition(action_data);
    }
}


module.exports = {
    initialize_action: initialize_action
  };