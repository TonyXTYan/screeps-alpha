var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // console.log('here ' + creep.memory.upgrading + " and " + creep.store[RESOURCE_ENERGY]
        // + ', ' + creep.store.getFreeCapacity() + ', ' + creep.room.controller)
        // console.log(creep.memory.upgrading === undefined)



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
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.memory.stationaryWorking = false
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else { // not upgrading, so harvest
            var sources = creep.room.find(FIND_SOURCES);
            // creep.stationaryWorking = true
            // console.log(creep.harvest(sources[0]))
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.stationaryWorking = false
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }



        // console.log(creep.room.find(FIND_).length)


	}
};

module.exports = roleUpgrader;
