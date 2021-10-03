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
            'state': cst.ACTION_EVENTS.SUCCESS,
            'message': "You have won 50 golds !"
        };
    }

}

module.exports = { Expedition };