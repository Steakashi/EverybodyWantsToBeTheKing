const dataHandler = require("../data");

class PlayerEffect{
    name;
    duration;

    constructor(name, duration){
        this.name = name;
        this.duration = duration;
    }

    is_over(){
        return this.duration <= 0;
    }    

    consume(){
        this.duration--;
    }
    
}


class AbstractAction{
    emitter;
    name;
    identifier;

    constructor(action_data) {
        this.emitter = dataHandler.get_user(action_data.emitter);
        this.name = action_data.name;
        this.identifier = action_data.identifier;
    }

    preprocess(){
        this.emitter.effects.forEach(effect => {
            effect.consume();
            if (effect.is_over()){ 
                var effect_index = this.emitter.effects.indexOf(effect);
                this.emitter.effects.splice(effect_index, 1);
             }
        })
    }

    initialize_effect(name, duration){
        return new PlayerEffect(name, duration);
    }
}

module.exports = {
    AbstractAction: AbstractAction
}


