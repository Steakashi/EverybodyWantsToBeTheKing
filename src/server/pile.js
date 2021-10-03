const dataHandler = require("./data");
const action_manager = require('./actions/action-manager');

class PileHandler{

    server;
    room;
    pile;
    actions_report;

    constructor(server){
        this.server = server;
        this.room = server.room;
        this.pile = [];
        this.actions_report = {};
    }

    add(action_data){
        this.pile.push(action_manager.initialize_action(action_data));
    }

    sort(){
        this.pile.sort((action1, action2) => (action1.emitter.agility >= action2.emitter.agility) ? 1 : -1);
    }

    fill_report(result){
        this.actions_report.push(result)
    }

    initialize_blank_report(){
        var actions_report = {};
        this.server.room.users.forEach(user => {
            actions_report[user.id] = [];
        })
        return actions_report
    }

    process(){
        if (this.pile.length == 0){
            return false
        }
        var actions_report = this.initialize_blank_report();
        this.pile.forEach(action => {
            console.log("[Room " + this.server.room.id + "][User " + action.emitter.id + "] Processing action [" + action.identifier + "]");
            var action_result = action.process();
            actions_report[action.emitter.id].push(action_result);
        })
        console.log("[Room " + this.server.room.id + "] No action left to process : all players have played. Beginning new round.");
        console.log(actions_report);
        this.server.emit_to_room(
            "players_update",
            {
              players: this.room.users
            }
          )
        console.log(this.server.room.users);
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


// class Action{
//     name;
//     emitter;
//     targets;
//     receivers;

//     constructor(name, order, player, targets, receivers){
//         this.order = order;
//         this.name = name;
//         this.emitter = this._get_list_of_users(player),
//         this.targets = this._get_list_of_users(targets),
//         this.receivers = this._get_list_of_users(receivers)
//     }

//     _get_list_of_users(users){
//         if ( !(Array.isArray(users)) ){ users = [users]; }
//         var retrieved_users = [];
//         users.forEach(user => {
//             retrieved_users.push(dataHandler.get_user(user));
//         })

//         return retrieved_users
//     }
    
//     process(server){
//         // get attribute
//         // emit to specific user (first find server)
//         var group_target = this.order[0];
//         console.log('--- 1')
//         console.log(group_target);
//         console.log('--- 2')
//         console.log(this[group_target]);
//         var call_target = this[group_target].shift();
//         if (call_target == undefined){
//             console.log('ORDER');
//             this.order.shift();
//             console.log(this.order)
//             console.log('ORDER END')
//             if (this.order.length == 0) { return false; }
//             else { return this.process(server); }
//         }
//         // TODO : server seems to be null, check why
//         console.log('--- 3')
//         console.log(call_target);
//         var emitted_data = {
//             'name': this.name,
//             'state' : group_target
//         }
//         dataHandler.get_server_instance(call_target.id).emit('play', emitted_data);
//         return true;

//     }
// }


module.exports = { 
    PileHandler: PileHandler
};
