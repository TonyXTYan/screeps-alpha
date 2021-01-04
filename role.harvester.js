var creepHarvest = require('creep.harvest');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.memory.harvestTargetSource === undefined) { creep.memory.harvestTargetSource = 0 }
            // var harvestTargetSource = creep.memory.harvestTargetSource
            // if(creep.harvest(sources[harvestTargetSource]) == ERR_NOT_IN_RANGE) {
            //     let attempt = creep.moveTo(sources[harvestTargetSource], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     if (attempt == ERR_NO_PATH) {
            //         harvestTargetSource = (harvestTargetSource + 1) % sources.length
            //         console.log(creep.name + ' now checking out ' + harvestTargetSource)
            //         creep.memory.harvestTargetSource = harvestTargetSource
            //     }
            // }
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
            } else {
                // console.log('move out of the way')
                creep.moveTo(29,17, {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
            }
        }
	}


    // harvest: function(creep) {
    //
    // }

};

module.exports = roleHarvester;
