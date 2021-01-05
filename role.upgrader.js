var creepHarvest = require('creep.harvest');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // console.log('here ' + creep.memory.upgrading + " and " + creep.store[RESOURCE_ENERGY]
        // + ', ' + creep.store.getFreeCapacity() + ', ' + creep.room.controller)
        // console.log(creep.memory.upgrading === undefined)

        // creep.say('hey')


        if(creep.memory.upgrading === undefined) {
            creep.memory.upgrading = false
        }

        // if(creep.memory.stationaryWorking === undefined) {
        //     creep.memory.stationaryWorking = false
        // }

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            // creep.memory.stationaryWorking = false;
            creep.say('🔄 harvest');
	    }

	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
            // moves to upgrade location
	    }

	    if(creep.memory.upgrading) {
            // creep.memory.stationaryWorking = true
            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.memory.stationaryWorking = false
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else { // not upgrading, so harvest
            creepHarvest.run(creep)
        }



        // console.log(creep.room.find(FIND_).length)


	}
};

module.exports = roleUpgrader;
