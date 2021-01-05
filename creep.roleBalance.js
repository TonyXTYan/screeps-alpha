var creepPopulationControl = require('creep.populationControl');

var creepRoleBalance = {

    trySpawn: function(spawn) {
        if (spawn.memory.full === undefined) { spawn.memory.full = -1 }

        // console.log(spawn)
        var extensionStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        })

        var totalEnergyAvailable = spawn.store.getUsedCapacity(RESOURCE_ENERGY)
        var totalEnergyPossible = 300
        for (var i in extensionStructures) {
            // console.log(extension)
            totalEnergyAvailable += extensionStructures[i].store.getUsedCapacity(RESOURCE_ENERGY)
            totalEnergyPossible += extensionStructures[i].store.getCapacity(RESOURCE_ENERGY)
        }
        // console.log(totalEnergyAvailable)

        if (totalEnergyAvailable == totalEnergyPossible) {
            if (spawn.memory.full < 0) {
                spawn.memory.full = Game.time
            }

            if (spawn.memory.full + 20 < Game.time) { // ready to spawn new creep
                var body = creepPopulationControl.balance([1,1,1,0, 0,0,0,0], totalEnergyPossible)
                let result = spawn.spawnCreep(body, 'Creep'+Game.time)
                console.log('Spawn was ' + result)
                spawn.memory.full = -1
            } else {
                console.log('👍🏻Ready to spawn a new Creep in ' + (spawn.memory.full + 20 - Game.time) + ' ticks')
            }
        }
    },


    balanceBuilderUpgrader: function(room) {
        var harvester = []
        var builder = []
        var upgrader = []
        for (let name in Game.creeps) {
            let creep = Game.creeps[name]
            let role = creep.memory.role
            if (role === undefined) { continue }
            if (role == 'harvester') { harvester.push(name) }
            else if (role == 'builder') { builder.push(name) }
            else if (role == 'upgrader') { upgrader.push(name) }
        }

        // console.log([harvester, builder, upgrader])

        // let sum = builder.length + upgrader.length
        let delta = builder.length - upgrader.length
        // console.log(delta)
        
        if (delta > 1) { // too much builder
            let creep = Game.creeps[builder[0]]
            creep.memory.role = upgrader
        } else if (delta < -1) { // too much upgrader
            let creep = Game.creeps[upgrader[0]]
            creep.memory.role = builder
        } else {
            // we're good
        }


    }


}


module.exports = creepRoleBalance
