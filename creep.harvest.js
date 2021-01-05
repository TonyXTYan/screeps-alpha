// Use this
var creepHarvest = {

    /**
     * run - Harvest ENERGY and put in the apporiate places
     *
     * @param  {type} creep description
     * @return {type}       description
     */
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var sourcesClosest = creep.pos.findClosestByPath(FIND_SOURCES); // might be nill if path is blocked

        // initialise stuff check
        if (creep.memory.harvestTargetSourceIndex === undefined) {creep.memory.harvestTargetSourceIndex = 0}
        if (creep.memory.harvestTargetSourceId === undefined) {
            if (sourcesClosest === undefined || sourcesClosest == null ) { creep.memory.harvestTargetSourceId = sources[0].id }
            else { creep.memory.harvestTargetSourceId = sourcesClosest.id }
        }
        let targetThisTick = Game.getObjectById(creep.memory.harvestTargetSourceId)
        if (creep.room.memory.sources === undefined) {
            creep.room.memory.sources = new Map();
            creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time] // [max, current, last check on max]
            console.log('⚠️ room.sources initialised')
        }
        if (creep.room.memory.sources[targetThisTick.id] === undefined) {
            creep.room.memory.sources[targetThisTick.id] = [8, 1, Game.time]
        }

        // try harvest the set target ENERGY source
        let harvestCode = creep.harvest(targetThisTick)

        if(harvestCode == ERR_NOT_IN_RANGE) {
            let attempt = creep.moveTo(targetThisTick, {visualizePathStyle: {stroke: '#3d2a22'}});

            // TODO: manages the amount of workers per source dynamics

            if (attempt == ERR_NO_PATH) {
                creep.say('🚦');
                console.log('congested')
                creepHarvest.findOtherOption(creep, attempt) // cannot find path to this target, find another one
            }

        } else if (harvestCode == ERR_INVALID_TARGET) { // hasn't harvesting, it's probably a storage kind
            // console.log('Creep ' + creep.name + ' is getting from container ' + targetThisTick.id)
            creep.say('🔋')
            // try withdraw from ENERGY storage
            let withdrawCode = creep.withdraw(targetThisTick, RESOURCE_ENERGY)
            if(withdrawCode == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetThisTick, {visualizePathStyle: {stroke: '#875641'}});
            } else if (withdrawCode != OK) { // something else went wrong
                creep.memory.harvestTargetSourceId = undefined // reset the target source
                // creep.memory.harvestTargetSourceIndex =
                console.log('creep.harvest withdraw failed with code: ' + withdrawCode + ' of target ' + targetThisTick + ' so reset')
            }
        } else if (harvestCode == ERR_NOT_ENOUGH_RESOURCES) {
            creep.say('🚱')
            creepHarvest.findOtherOption(creep)
        } else if (harvestCode != OK) {
            console.log('creep.harvest failed with code: ' + harvestCode)
        }
    },


    /**
     * findOtherOption - Find alternative target for source
     *
     * @param  {type} creep description
     * @return {type}       description
     */
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


    /**
     * useContainer - Find and use a container
     *
     * @param  {type} creep description
     * @return {type}       description
     */
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
}

module.exports = creepHarvest
