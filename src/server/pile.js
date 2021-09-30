const dataHandler = require("./data");

class PileHandler{

    server;
    room;
    pile;

    constructor(server){
        this.server = server;
        this.room = server.room;
        this.pile = [];
    }

    add(action){
        this.pile.push(action);
    }

    sort(){
        console.log(this.pile);
        this.pile.sort((action1, action2) => (action1.emitter.agility >= action2.emitter.agility) ? 1 : -1);
    }

    process(){
        if (this.pile.length == 0){
            console.log("[Room " + this.server.room.id + "] No action left to process : all players have played. Beginning new round.");
            return false
        }
        var action = this.pile[0]; //pile.shift()
        var action_processed = action.process(this.server);
        if (!action_processed){
            this.pile.shift();
            return this.process();
        }

        return true
        //if (!result){
            //console.log("[Room " + this.server.room.id + "] All players have played. Beginning new round.")
            //this.server.emit_to_room("end_round"); 
            //begin_turn(this.server);
        //}
        /*
        if (action !== undefined){ action.process(server); }
        else{ 
            console.log("[Room " + server.room.id + "] All players have played. Beginning new round.")
            server.emit_to_room("end_round"); 
            begin_turn(server);
        }*/
    }

}


class Action{
    name;
    emitter;
    targets;
    receivers;

    constructor(name, order, player, targets, receivers){
        this.order = order;
        this.name = name;
        this.emitter = this._get_list_of_users(player),
        this.targets = this._get_list_of_users(targets),
        this.receivers = this._get_list_of_users(receivers)
    }

    _get_list_of_users(users){
        if ( !(Array.isArray(users)) ){ users = [users]; }
        var retrieved_users = [];
        users.forEach(user => {
            retrieved_users.push(dataHandler.get_user(user));
        })

        return retrieved_users
    }
    
    process(server){
        // get attribute
        // emit to specific user (first find server)
        var group_target = this.order[0];
        console.log('--- 1')
        console.log(group_target);
        console.log('--- 2')
        console.log(this[group_target]);
        var call_target = this[group_target].shift();
        if (call_target == undefined){
            console.log('ORDER');
            this.order.shift();
            console.log(this.order)
            console.log('ORDER END')
            if (this.order.length == 0) { return false; }
            else { return this.process(server); }
        }
        // TODO : server seems to be null, check why
        console.log('--- 3')
        console.log(call_target);
        var emitted_data = {
            'name': this.name,
            'state' : group_target
        }
        dataHandler.get_server_instance(call_target.id).emit('play', emitted_data);
        return true;

    }
}


module.exports = { 
    PileHandler: PileHandler, 
    Action: Action
};
