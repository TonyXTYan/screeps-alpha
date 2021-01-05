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

    energyTargetExtensions: function(creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))
            }
        })
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.dumping === undefined) {
            creep.memory.dumping = creep.store.getUsedCapacity() > 30
        }

        if(creep.memory.dumping && creep.store.getUsedCapacity() == 0) {
            creep.memory.dumping = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.dumping && creep.store.getFreeCapacity() == 0) {
	        creep.memory.dumping = true;
	        creep.say('🗑dump');
	    } // FIXME: duplicate with previous roles


	    if(!creep.memory.dumping) {
            creepHarvest.run(creep)
        } else {
            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            var energyTargets = roleHarvester.energyTargets(creep)

            if(energyTargets.length > 0) { // && creep.store.getFreeCapacity() > 0) {
                let extension = roleHarvester.energyTargetExtensions(creep)
                var target = energyTargets[0]
                if (extension != undefined || extension != null) {
                    creep.say('🟡')
                    var target = extension
                }

                // console.log(creep.name + ' going to ' + target)

                let transferCode = creep.transfer(target, RESOURCE_ENERGY)
                if(transferCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transferCode != OK) {
                    console.log('role.harvester: transfer return code): ' + transferCode)
                }

            } else if (!roleDoctor.repairJob(creep)) { // no repair job`
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'harvester') { counter++ }
                }

                if (counter <= 2) {
                    console.log('role.harvester: last harvester, so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                } else {
                    console.log(creep.name + ' not doing anything, erasing his memory💾')
                    creep.memory = undefined
                }


            } else {
                console.log('role.harvester: this should not happen (no repair job?)')
            }
        }
	}

};

module.exports = roleHarvester;
