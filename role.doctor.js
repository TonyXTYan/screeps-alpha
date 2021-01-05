// repair and healing
var creepHarvest = require('creep.harvest');

var roleDoctor = {

    repairTargetToRepair: function(creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => { return (structure.hits < structure.hitsMax) }
        })
    },

    repairJob: function(creep) {
        var repairTarget = roleDoctor.repairTargetToRepair(creep)
        // console.log(repairTarget)
        if (repairTarget) {
            let repairCode = creep.repair(repairTarget)
            if (repairCode == ERR_NOT_IN_RANGE) {
                creep.say('🩹')
                creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#b0f566'}})
            } else if (repairCode != OK) {
                console.log('role.doctor: for creep ' + creep.name + 'repair return code: ' + repairCode)
            }
            return true
        } else { // no repair required
            console.log('role.doctor: ' + creep.name + 'all repaired ' + repairTarget)
            return false
        }
    },

    run: function(creep) {

        if(creep.memory.repairing === undefined) {
            creep.memory.repairing = creep.store.getUsedCapacity() > 30
        }

	    if(creep.memory.repairing && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.repairing = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🩹');
	    }

        if (creep.memory.repairing) {
            let healTargets = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => { return c.hits < c.hitsMax }
            })

            if(healTargets.length > 0) { // && creep.store.getFreeCapacity() > 0) {
                let transferCode = creep.heal(healTargets[0])
                if(transferCode == ERR_NOT_IN_RANGE) {
                    // creep.say('⚡️')
                    creep.moveTo(healTargets[0], {visualizePathStyle: {stroke: '#65fd62'}});
                } else {
                    console.log('role.doctor: heal return code: ' + transferCode)
                }

            }
            else if (!roleDoctor.repairJob(creep)) {
                var counter = 0
                for (let name in Game.creeps) {
                    let creep = Game.creeps[name]
                    if (creep.memory.role == 'doctor') { counter++ }
                }

                if (counter <= 2) {
                    console.log('role.doctor: doctor job done, so moving it to Spawn 1')
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#fafafa'}}) // just move out of the way
                }
            }
        } else {
            creepHarvest.run(creep)
        }

    }
}

module.exports = roleDoctor
