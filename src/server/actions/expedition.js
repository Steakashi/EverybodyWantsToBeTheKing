const dataHandler = require("../data");
const cst = require("../constants");

class Expedition{
    name;

    constructor(action_data) {
        this.emitter = dataHandler.get_user(action_data.emitter);
        this.name = action_data.name;
        this.identifier = action_data.identifier;
    }

    process(){
        this.emitter.golds += 50;
        return {
            'emitter': this.emitter.id,
            'state': cst.ACTION_EVENTS.SUCCESS,
            'custom_message': "You have won 50 golds !",
            'public_message' : this.emitter.name + " has won 50 golds."
        };
    }

}

module.exports = { Expedition };