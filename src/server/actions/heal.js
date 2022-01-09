const dataHandler = require("../data");
const cst = require("../constants");
const { AbstractAction } = require("./abstract-action");


HEAL_VALUE = 2;


class Heal extends AbstractAction{

    constructor(name, duration) {
        super(name, duration);
    }

    process(){
        var heal_value = this.emitter.max_life - this.emitter.life;
        if (heal_value > HEAL_VALUE) heal_value = HEAL_VALUE;
        this.emitter.effects.push(
            this.initialize_effect(cst.PLAYER_EFFECT.RESTED, 1)
        );
        return {
            'emitter': this.emitter.id,
            'effect': cst.ACTION_EVENTS.SUCCESS,
            'custom_message': "You recovered " + heal_value + " life point(s) !",
            'public_message' : this.emitter.name + " has recovered " + heal_value + " life point(s)."
        };
    }

}

module.exports = { Heal };