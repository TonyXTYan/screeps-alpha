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

            if(targets.length) { // if(length != 0)
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffb752'}});
                    // creep.say('↘️ To ' + targets[0].)
                }
            } else {
                // console.log('finally')
                // console.log(creep.name + ' not doing anything, erasing his memory💾 TODO')
                // delete creep.memory
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'builder') { counter++ }
                }

                if (counter <= 1) {
                    console.log('last builder, so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                } else {
                    console.log(creep.name + ' not doing anything, erasing his memory💾')
                    creep.memory = undefined
                }
            }

	    }
	    else { // not building
            creepHarvest.run(creep)
	    }
	}
};

module.exports = roleBuilder;
