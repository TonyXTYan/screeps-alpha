// var contractAgent = require('contract.agent');
var utility = require('utility');

var spawnController = {

    run: function() {
        for(var name in Game.spawns) {
            // let spawn = Game.spawns[name]
            spawnController.checkSpawn(Game.spawns[name])
        }
    },

    checkSpawn: function(spawn) {
        // var log = ""
        // console.log(' ')
        console.log("spawnController: called on " + spawn.name + ' in room ' + spawn.room.name)
        // console.log("Spawn hits: " + spawn.hits + ' of ' + spawn.hitsMax)
        // console.log("Spawn energy: " + spawn.store.getUsedCapacity(RESOURCE_ENERGY) + ' of ' + spawn.store.getCapacity(RESOURCE_ENERGY))

        // console.log(spawn.memory.contracted)
        if(spawn.memory.contracted === undefined) { spawn.memory.contracted = false }
        if(spawn.memory.contract === undefined) { spawn.memory.contract = null }

        // console.log('Spawn ' + spawn.name + ' exited')

        // utility.computeSourcePropertyInRoom(spawn.room)
    }

    // spawn
    // renew
    // recycle




}

module.exports = spawnController
