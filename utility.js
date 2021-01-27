var CONSTANTS = require('constants')

var utility = {

    runForAllRooms: function(func) {
        // FIXME: pileup these functions and execut them in one go (maybe?)
        for (name in Game.rooms) {
            let room = Game.rooms[name]
            func(room)
        }
    },

    initialSetupEnvironmentCheck: function() {
        utility.runForAllRooms(utility.initialSetupEnvironmentCheckForRoom)
    },

    initialSetupEnvironmentCheckForRoom: function(room) {
        console.log('utility.initialSetupEnvironmentCheckForRoom: called')
        utility.basicMemoryCheck()
        Memory.jobsCreatedThisTick = 0
        if (room.memory.sourcesChecked === undefined) {
            utility.computeSourcePropertyInRoom(room)
        } else if (room.memory.sourcesChecked + CONSTANTS.FREQ_LOW < Game.time) { //FIXME: schedule
            utility.computeSourcePropertyInRoom(room)
        }

        if (Memory.myUsername === undefined) {
            // console.log(Game.spawns[Object.keys(Game.spawns)[0]])
            Memory.myUsername = Game.spawns[Object.keys(Game.spawns)[0]].owner.username
        }

        if (Memory.jobs === undefined) { Memory.jobs = {} }

        // if (Mem)
    },


    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        function calculate(source) {
            let pos = source.pos

            let lookResult = room.lookForAtArea(LOOK_TERRAIN, Math.max(0,  pos.y-1), Math.max(0,  pos.x-1)
                                                            , Math.min(49, pos.y+1), Math.min(49, pos.x+1), true)
            var spaceCounter = 0
            var containersNearby = []
            for (let index in lookResult) {
                let item = lookResult[index]
                // console.log('(' + item.x + ', ' + item.y + ') is ' + item.terrain)
                if ((item.x == source.pos.x && item.y == source.pos.y)) { continue } // not equal to source.pos
                else {
                    if (item.terrain != 'wall') { spaceCounter++ }
                    // console.log(room.lookForAt(LOOK_STRUCTURES, item.x, item.y)[0].structure.structureType == STRUCTURE_CONTAINER)
                    let found = room.lookForAt(LOOK_STRUCTURES, item.x, item.y)
                    // console.log(found)
                    // if (found !== undefined && found.structureType == STRUCTURE_CONTAINER) {
                    //     // console.log(found.structureType)
                    //     containersNearby.push(found.id)
                    // }
                    for (let index_found in found) {
                        let structure = found[index_found]
                        // console.log(structure)
                        if (structure.structureType == STRUCTURE_CONTAINER) {
                            containersNearby.push(structure.id)
                        }
                    }

                }
            }
            return [spaceCounter, containersNearby]
        }

        if (room.memory.sources === undefined) { room.memory.sources = {} }

        for (name in sources) {
            let source = sources[name]
            let result = calculate(source)
            // console.log(result)s
            let spaceCounter = result[0]
            let containersNearby = result[1]
            // console.log(source + ' at ' + source.pos + ' has space ' + freeSpace)
            // room.memory.sources[source.id] = { spaceCounter: spaceCounter, containersNearby: containersNearby }
            if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
            room.memory.sources[source.id].spaceCounter = spaceCounter
            room.memory.sources[source.id].containersNearby = containersNearby
        }
        room.memory.sourcesChecked = Game.time
    },

    resetMemory: function() {
        Memory = undefined
        Memory.creeps = {};
        Memory.spawns = {};
        Memory.rooms = {};
        Memory.flags = {};
    },

    basicMemoryCheck: function() {
        if (Memory.creeps === undefined) { Memory.creeps = {} }
        if (Memory.spawns === undefined) { Memory.spawns = {} }
        if (Memory.rooms  === undefined) { Memory.rooms = {} }
        if (Memory.flags  === undefined) { Memory.flags = {} }
    },


    countExclusionZones: function() {
        var accum = 0
        for (name in Game.flags) {
            // console.log(name)
            if (name == 'exclusion_zone') {
                accum++
            }
        }
        return accum
    },


    /**
     * countEnergy - Count how much energy can this spawn spawn
     * @param  {type} spawn description
     * @return {type}       description
     */
    countEnergy: function(spawn) {
        var extensionStructures = spawn.room.find(FIND_MY_STRUCTURES, { filter: utility.structureFilter.isExtension })
        var totalEnergyAvailable = spawn.store.getUsedCapacity(RESOURCE_ENERGY)
        var totalEnergyCapacity = 300
        for (var i in extensionStructures) {
            // console.log(extension)
            totalEnergyAvailable += extensionStructures[i].store.getUsedCapacity(RESOURCE_ENERGY)
            totalEnergyCapacity += extensionStructures[i].store.getCapacity(RESOURCE_ENERGY)
        }
        return {available: totalEnergyAvailable, capacity: totalEnergyCapacity}
    },

    /**
     * balanceSpec - Try to balance the specification given with given energy levels
     *
     * @param  {type} spec   description
     * @param  {type} energy description
     * @return {type}        description
     */
    balanceSpec: function(spec, energy) {
        // var sum = spec.reduce((a, b) => a + b, 0)
        const bodyPartName = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        const bodyPartCost = [50,   100,  50,    80,     150,           250,  600,   10   ]

        var weighted = []
        var weightedSum = 0
        for (i in spec){
            var c = spec[i] * bodyPartCost[i]
            weighted[i] = c
            weightedSum += c
        }
        var scale = energy / weightedSum

        var parts = []
        for (i in spec) {
            var count = Math.floor(weighted[i] * scale / bodyPartCost[i])
            for (c in Array(count).fill(0)) {
                parts.push(bodyPartName[i])
            }
        }
        return parts
    },

    general: {
        arrayDeleteOne: function(array, value) {
            var index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        },
        getRandomInt: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },

    structureFilter: {
        hasFreeEnergyCapacity: function(structure) {
            if (structure.store === undefined) { return false }
            else { return (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) }
        },

        isExtension: function(structure) { return structure.structureType == STRUCTURE_EXTENSION; }

        // ownerIsMe: function(structure) { return structure.owner == Memory.myUsername }
    },

}

module.exports = utility;
