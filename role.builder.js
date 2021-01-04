// var checkedOutSource = 0
var creepHarvest = require('creep.harvest');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // console.log(creep.store.getUsedCapacity())
        // console.log(c)

	    if(creep.memory.building && creep.store.getUsedCapacity() == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // console.log(targets.length)
            
            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    // creep.say('↘️ To ' + targets[0].)
                }
            }
	    }
	    else { // not building
            creepHarvest.run(creep)
	        // var sources = creep.room.find(FIND_SOURCES);
            //
            // if (creep.memory.harvestTargetSource === undefined) {
            //     creep.memory.harvestTargetSource = 0
            // }
            // var harvestTargetSource = creep.memory.harvestTargetSource
            //
            // if(creep.harvest(sources[harvestTargetSource]) == ERR_NOT_IN_RANGE) {
            //     // console.log(creep.moveTo(sources[0]))
            //     // checkedOutSource = 0
            //     let attempt = creep.moveTo(sources[harvestTargetSource], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     // checkedOutSource ++
            //
            //     if (attempt == ERR_NO_PATH) {
            //         // checkedOutSource ++
            //         harvestTargetSource = (harvestTargetSource + 1) % sources.length
            //         console.log(creep.name + ' now checking out ' + harvestTargetSource)
            //         creep.memory.harvestTargetSource = harvestTargetSource
            //     }
            //
            //     // if (attempt == ERR_NO_PATH && sources[1] !== undefined) {
            //     //     creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     // }
            // }
	    }
	}
};

module.exports = roleBuilder;
