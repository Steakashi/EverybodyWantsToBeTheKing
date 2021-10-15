const cst = require("../constants");
const { AbstractAction } = require("./abstract-action");


class Expedition extends AbstractAction{

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