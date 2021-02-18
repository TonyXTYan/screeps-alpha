var utility = require('utility');
var creepRole = require('creep.role');


var spawnExecution = {
    run: function() {
        utility.runForAllRooms(spawnExecution.checkSpawnInRoom)
    },

    checkSpawnInRoom: function(room) {
        if (!room.controller.my) { return }
        // console.log()
        let spawns = room.find(FIND_MY_SPAWNS)
        for (let i in spawns) {
            let spawn = spawns[i]
            spawnExecution.spawnSpecific(spawn)
        }
    },

    spawnSpecific: function(spawn) {
        console.log('spawnExecution.spawnSpecific: called on ' + spawn)

        if (spawn.spawning !== null) { return }
        //
        let room = spawn.room
        let queue = room.memory.creepSpawnJointQueue


        let role = queue[0]
        if (role === undefined) { console.log('spawnExecution.spawnSpecific: ' + spawn.name + ' in ' + room.name + ' without a job'); return }

        console.log('role: ' + role)

        let body = creepRole.ROLE_TYPE[role].bodyFromSpawn(spawn)
        console.log('body: ' + body)


    },

}
module.exports = spawnExecution
