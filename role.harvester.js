var creepHarvest = require('creep.harvest');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            creepHarvest.run(creep)
        } else {
            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            // console.log(targets.length)
            if(targets.length > 0) { // && creep.store.getFreeCapacity() > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    // creep.say('↘️ to ' + targets[0].name)
                }
            } else { // no more target
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


            }
        }
	}


    // harvest: function(creep) {
    //
    // }

};

module.exports = roleHarvester;
