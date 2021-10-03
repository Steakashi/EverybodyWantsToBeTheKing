const dataHandler = require("../data");

class Expedition{
    name;

    constructor(action_data) {
        console.log(user);
        console.log(action_data)
        this.emitter = dataHandler.get_user(action_data.emitter);
        this.name = action_data.name;
    }

}

module.exports = { Expedition };