var contractAgent = require('contract.scheduler');

var spawnController = {

    run: function(spawn) {
        // var log = ""
        console.log("Spawn is " + spawn.name + ' in room ' + spawn.room.name)
        console.log("Spawn hits: " + spawn.hits + ' of ' + spawn.hitsMax)
        console.log("Spawn energy: " + spawn.store.getUsedCapacity(RESOURCE_ENERGY) + ' of ' + spawn.store.getCapacity(RESOURCE_ENERGY))

        // console.log(spawn.memory.contracted)
        if(spawn.memory.contracted === undefined) { spawn.memory.contracted = false }
        if(spawn.memory.contract === undefined) { spawn.memory.contract = null }

        console.log('Spawn ' + spawn.name + ' exited')
    }

    // spawn
    // renew
    // recycle



}

module.exports = spawnController
