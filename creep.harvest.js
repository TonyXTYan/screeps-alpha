// Use this
var creepHarvest = {
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var sourcesClosest = creep.pos.findClosestByPath(FIND_SOURCES);
        // console.log('SOURCES2: ' + sources2)
        // console.log(sources[0], sources2[2])

        if (creep.memory.harvestTargetSourceIndex === undefined) {creep.memory.harvestTargetSourceIndex = 0}
        if (creep.memory.harvestTargetSourceId === undefined) {
            if (sourcesClosest === undefined || sourcesClosest == null ) { creep.memory.harvestTargetSourceId = sources[0].id }
            else { creep.memory.harvestTargetSourceId = sourcesClosest.id }
        }
        var harvestTargetSourceId = creep.memory.harvestTargetSourceId
        var harvestTargetSourceIndex = creep.memory.harvestTargetSourceIndex

        let targetThisTick = Game.getObjectById(harvestTargetSourceId)

        if (creep.room.memory.sources === undefined) {
            creep.room.memory.sources = new Map();
            creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time] // [max, current, last check on max]
            console.log('⚠️ room.sources initialised')
        }

        if (creep.room.memory.sources[targetThisTick.id] === undefined) {
            creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time]
        }

        let harvestCode = creep.harvest(targetThisTick)

        if(harvestCode == ERR_NOT_IN_RANGE) {
            let attempt = creep.moveTo(targetThisTick, {visualizePathStyle: {stroke: '#3d2a22'}});
            // creep.say('▶️ to ' + harvestTargetSource)

            // let source = sources[harvestTargetSource]
            // console.log(targetThisTick.id)
            // if (source.memory.maxCocurrentWorker === undefined) { source.memory.maxCocurrentWorker = 8 }
            // console.log(source.memory.maxCocurrentWorker)

            // console.log(creep.room.memory.sources[targetThisTick.id])

            // if (creep.memory.harvestTargetSource)

            if (attempt == ERR_NO_PATH) {
                creep.say('🚦');
                console.log('congested')
                creepHarvest.findOtherOption(creep, attempt)
            }

        } else if (harvestCode == ERR_INVALID_TARGET) {
            // console.log('Creep ' + creep.name + ' is getting from container ' + targetThisTick.id)
            creep.say('🔋')
            let withdrawCode = creep.withdraw(targetThisTick, RESOURCE_ENERGY)
            if(withdrawCode == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetThisTick, {visualizePathStyle: {stroke: '#875641'}});
            // } else if (withdrawCode == ERR_INVALID_TARGET) {
                // creep.memory.harvestTargetSourceId = undefined
            } else if (withdrawCode != OK) {
                creep.memory.harvestTargetSourceId = undefined
                // creep.memory.harvestTargetSourceIndex =
                console.log('creep.harvest withdrawCode: ' + withdrawCode + ' of target ' + targetThisTick + ' so reset')
            }
        } else if (harvestCode == ERR_NOT_ENOUGH_RESOURCES) {
            creep.say('🚱')
            creepHarvest.findOtherOption(creep)
            // creepHarvest.useContainer(creep)
        } else if (harvestCode != OK) {
            console.log('creep.harvest harvestCode: ' + harvestCode)
        }
    },

    findOtherOption: function(creep) {
        if (creep.memory.role == 'harvester') {
            var sources = creep.room.find(FIND_SOURCES);

            var harvestTargetSourceId = creep.memory.harvestTargetSourceId
            var harvestTargetSourceIndex = creep.memory.harvestTargetSourceIndex

            harvestTargetSourceIndex = (harvestTargetSourceIndex + 1) % sources.length
            harvestTargetSourceId = sources[harvestTargetSourceIndex].id
            creep.memory.harvestTargetSourceIndex = harvestTargetSourceIndex
            creep.memory.harvestTargetSourceId = harvestTargetSourceId
            console.log(creep.name + ' will harvest index ' + harvestTargetSourceIndex + ' which is ' + creep.memory.harvestTargetSourceId)

            var counter = 0
            for(var name in Game.creeps) {
                var c = Game.creeps[name];
                if (c.memory.harvestTargetSourceId == harvestTargetSourceId) {
                    counter ++
                }
            }
            creep.room.memory.sources[harvestTargetSourceId] = [counter, counter, Game.time]

        } else { // not role.harvester
            creepHarvest.useContainer(creep)
        }
    },

    useContainer: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                       (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 2 * creep.store.getCapacity(RESOURCE_ENERGY));
            }
        });
        var source = creep.pos.findClosestByPath(containers);
        if (source) {
            creep.memory.harvestTargetSourceIndex = -1
            creep.memory.harvestTargetSourceId = source.id
        }
    }


    // withdraw: function(creep) {
    //     var containers = creep.room.find(FIND_STRUCTURES, {
    //         filter: (structure) => {
    //             return (structure.structureType == STRUCTURE_CONTAINER) &&
    //                    (structure.store.getCapacity(RESOURCE_ENERGY) > 0);
    //         }
    //     });
    //     var source = creep.pos.findClosestByPath(containers);
    //     if (source) {
    //         if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(source, {visualizePathStyle: {stroke: '#ab3605'}});
    //         }
    //     }
    // }

}

module.exports = creepHarvest
