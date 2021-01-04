// Use this
var creepHarvest = {
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if (creep.memory.harvestTargetSourceIndex === undefined) {creep.memory.harvestTargetSourceIndex = 0}
        if (creep.memory.harvestTargetSourceId === undefined) { creep.memory.harvestTargetSourceId = sources[0].id }
        var harvestTargetSourceId = creep.memory.harvestTargetSourceId
        var harvestTargetSourceIndex = creep.memory.harvestTargetSourceIndex

        let targetThisTick = Game.getObjectById(harvestTargetSourceId)

        if(creep.harvest(targetThisTick) == ERR_NOT_IN_RANGE) {
            let attempt = creep.moveTo(targetThisTick, {visualizePathStyle: {stroke: '#ffe883'}});
            // creep.say('▶️ to ' + harvestTargetSource)

            // let source = sources[harvestTargetSource]
            // console.log(targetThisTick.id)
            // if (source.memory.maxCocurrentWorker === undefined) { source.memory.maxCocurrentWorker = 8 }
            // console.log(source.memory.maxCocurrentWorker)

            if (creep.room.memory.sources === undefined) {
                creep.room.memory.sources = new Map();
                creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time] // [max, current, last check on max]
                console.log('⚠️ room.sources initialised')
            }

            if (creep.room.memory.sources[targetThisTick.id] === undefined) {
                creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time]
            }

            // console.log(creep.room.memory.sources[targetThisTick.id])

            // if (creep.memory.harvestTargetSource)

            if (attempt == ERR_NO_PATH) {
                creep.say('🚦Congested');
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

                console.log('congested with ' + counter)
            }

        }


    }
}

module.exports = creepHarvest
