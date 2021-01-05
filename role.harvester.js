var creepHarvest = require('creep.harvest');
var roleDoctor = require('role.doctor');

var roleHarvester = {

    energyTargets: function(creep) {
        return creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER) &&
                           (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))
                }
        });
    },

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            creepHarvest.run(creep)
        } else {
            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            var energyTargets = roleHarvester.energyTargets(creep)

            // var repairTargets = roleDoctor.repairTargets(creep)

            // console.log(energyTargets.length + ' and ' + repairTargets.length)

            if(energyTargets.length > 0) { // && creep.store.getFreeCapacity() > 0) {
                let transferCode = creep.transfer(energyTargets[0], RESOURCE_ENERGY)
                if(transferCode == ERR_NOT_IN_RANGE) {
                    // creep.say('⚡️')
                    creep.moveTo(energyTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transferCode != OK) {
                    console.log('deal with this (return code, transfer): ' + transferCode)
                }

            } else if (!roleDoctor.repairJob(creep)) { // no repair job
            // else { // no more target
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'harvester') { counter++ }
                }

                if (counter <= 2) {
                    console.log('last harvester, so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                } else {
                    console.log(creep.name + ' not doing anything, erasing his memory💾')
                    creep.memory = undefined
                }


            } else {
                console.log('role.harvester this should not happen')
            }
        }
	}


    // harvest: function(creep) {
    //
    // }

};

module.exports = roleHarvester;
