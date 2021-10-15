const dataHandler = require("../data");
const cst = require("../constants");
const { AbstractAction } = require("./abstract-action");


class Heal extends AbstractAction{

    constructor(name, duration) {
        super(name, duration);
      }

    process(){
        this.emitter.life += 2;
        this.emitter.states.push(
            this.initialize_state(cst.PLAYER_STATE.RESTED, 1)
        );
        return {
            'emitter': this.emitter.id,
            'state': cst.ACTION_EVENTS.SUCCESS,
            'custom_message': "You recovered 2 life points !",
            'public_message' : this.emitter.name + " has recovered 2 life points."
        };
    }

}

module.exports = { Heal };