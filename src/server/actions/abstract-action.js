const dataHandler = require("../data");

class PlayerState{
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
        console.log(this.emitter.states);
        this.emitter.states.forEach(state => {
            state.consume();
            if (state.is_over()){ 
                var state_index = this.emitter.states.indexOf(state);
                this.emitter.states.splice(state_index, 1);
             }
        })
    }

    initialize_state(name, duration){
        return new PlayerState(name, duration);
    }
}

module.exports = {
    AbstractAction: AbstractAction
}


