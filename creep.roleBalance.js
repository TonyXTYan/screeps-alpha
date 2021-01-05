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
        var totalEnergyCapacity = 300
        for (var i in extensionStructures) {
            // console.log(extension)
            totalEnergyAvailable += extensionStructures[i].store.getUsedCapacity(RESOURCE_ENERGY)
            totalEnergyCapacity += extensionStructures[i].store.getCapacity(RESOURCE_ENERGY)
        }
        // console.log(totalEnergyAvailable)

        if (totalEnergyAvailable == totalEnergyCapacity) {
            if (spawn.memory.full < 0) {
                spawn.memory.full = Game.time
            }

            if (spawn.memory.full + 20 < Game.time) { // ready to spawn new creep
                var body = creepPopulationControl.balance([1,1,1,0, 0,0,0,0], totalEnergyCapacity)
                let result = spawn.spawnCreep(body, 'Creep'+Game.time)
                console.log('Spawn was ' + result)
                spawn.memory.full = -1
            } else {
                console.log('👍🏻Ready to spawn a new Creep in ' + (spawn.memory.full + 20 - Game.time) + ' ticks')
            }
        } else {
            console.log('Have energy of ' + totalEnergyAvailable + ' out of ' + totalEnergyCapacity)
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

        var targets = room.find(FIND_CONSTRUCTION_SITES);
        // console.log(targets.length)

        // console.log([harvester, builder, upgrader])

        // let sum = builder.length + upgrader.length
        // let delta = builder.length - upgrader.length
        // console.log('delta: ' + delta + ', constructions: ' + targets.length)

        if (builder.length > targets.length && builder.length > 1 || (builder.length > 2 && upgrader.length == 0)) { // too much builder
            console.log('Too much builder (more than one per construction), changing one to upgrader')
            let creep = Game.creeps[builder[0]]
            creep.memory.role = 'upgrader'
        } else if (builder.length < targets.length && upgrader.length > 1) { // too much upgrader
            console.log('Too much upgrader (need more builder on constructions), changing one to builder')
            let creep = Game.creeps[upgrader[0]]
            creep.memory.role = 'builder'
        } else {
            // console.log('hey hey?')
            // console.log('no change ' + builder.length + ', ' + upgrader.length)
            // we're good
        }


    }


}


module.exports = creepRoleBalance
