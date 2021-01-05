// repair and healing
var creepHarvest = require('creep.harvest');

var roleDoctor = {

    repairTargets: function(creep) {
        return creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_ROAD ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_RAMPART ||
                        structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_TOWER) &&
                       (structure.hits < structure.hitsMax))
            }
        })
    },

    run: function(creep) {

        let healTargets = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => { return c.hits < c.hitsMax }
        })

        let repairTargets = roleDoctor.repairTargets(creep)

        // console.log('we have a doctor here, ' + healTargets.length + ', ' + repairTargets.length)

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
            creepHarvest.run(creep)
        } else { // have energy
            if(healTargets.length > 0) { // && creep.store.getFreeCapacity() > 0) {
                let transferCode = creep.heal(healTargets[0])
                if(transferCode == ERR_NOT_IN_RANGE) {
                    // creep.say('⚡️')
                    creep.moveTo(healTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    console.log('deal with this (return code, heal): ' + transferCode)
                }

            }
            else if (repairTargets.length > 0) {
                let repairCode = creep.repair(repairTargets[0])
                if (repairCode == ERR_NOT_IN_RANGE) {
                    // creep.say('🩹')
                    creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#b0f566'}})
                } else {
                    console.log('deal with this (return code, reapir): ' + repairCode)
                }
            }
            else { // no more target
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'harvester') { counter++ }
                }

                if (counter <= 2) {
                    console.log('doctor job done, so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                } else {
                    console.log(creep.name + ' not doing anything, erasing his memory💾')
                    creep.memory = undefined
                }


            }
        }

    }
}

module.exports = roleDoctor
