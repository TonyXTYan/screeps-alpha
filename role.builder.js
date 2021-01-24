// var checkedOutSource = 0
var creepHarvest = require('creep.harvest');
var roleDoctor = require('role.doctor');

var roleBuilder = {

    /**
     * run - description
     *
     * @param  {type} creep description
     * @return {type}       description
     */
    run: function(creep) {

        if(creep.memory.building === undefined) {
            creep.memory.building = creep.store.getUsedCapacity() > 30
        }

	    if(creep.memory.building && creep.store.getUsedCapacity() == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            creep.memory.harvestTargetSourceId = undefined
            creep.memory.harvestTargetSourceIndex = undefined

            if(target) { // have construction site
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffb752'}});
                    // creep.say('↘️ To ' + targets[0].)
                }
            } else if (!roleDoctor.repairJob(creep)) { // else if try repair something
                // nothing to repair
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'builder') { counter++ }
                }

                if (counter <= 1) {
                    console.log('role.builder: last builder, ' + creep.name + ' so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                } else {
                    console.log('role.builder: ' +creep.name + ' not doing anything, erasing his memory💾')
                    creep.memory = undefined
                }
            } else {
                // builder went repaired something
            }

	    }
	    else { // not building, so go harvest
            creepHarvest.run(creep)
	    }
	}
};

module.exports = roleBuilder;
