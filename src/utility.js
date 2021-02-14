var CONSTANTS = require('constants')

var utility = {

    runForAllRooms: function(func) {
        // FIXME: pileup these functions and execut them in one go (maybe?)
        for (name in Game.rooms) {
            let room = Game.rooms[name]
            func(room)
        }
    },

    runForAllCreeps: function(func) {
        for (name in Game.creeps) {
            let creep = Game.creeps[name]
            func(creep)
        }
    },

    runForAllSpawns: function(func) {
        for (name in Game.spawns) {
            let spawn = Game.spawns[name]
            func(spawn)
        }
    },

    initialSetupEnvironmentCheck: function() {
        utility.basicMemoryCheck()
        utility.runForAllRooms(utility.initialSetupEnvironmentCheckForRoom)
    },

    initialSetupEnvironmentCheckForRoom: function(room) {
        // console.log('utility.initialSetupEnvironmentCheckForRoom: called on ' + room.name)
        if (room.memory.sourcesChecked === undefined) { utility.computeSourcePropertyInRoom(room) }
        if (room.memory.sourcesChecked + CONSTANTS.FREQ_LOW < Game.time) { //FIXME: schedule
            utility.computeSourcePropertyInRoom(room)
        }

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

                    for (let index_found in found) {
                        let structure = found[index_found]
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
            let spaceCounter = result[0]
            let containersNearby = result[1]
            // console.log(source + ' at ' + source.pos + ' has space ' + freeSpace)
            if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
            room.memory.sources[source.id].spaceCounter = spaceCounter
            room.memory.sources[source.id].containersNearby = containersNearby
        }
        room.memory.sourcesChecked = Game.time
    },

    totalSourceSpots: function(room) {
        var total = 0
        for(let id in room.memory.sources) {
            total += room.memory.sources[id].spaceCounter
        }
        return total
    },

    resetMemory: function() {
        for (let key in Memory) {
            Memory[key] = undefined
        }
        utility.basicMemoryCheck()
        utility.initialSetupEnvironmentCheck()
        console.log('💣utility.resetMemory: job done 💥')
    },

    basicMemoryCheck: function() {
        // console.log('utility.basicMemoryCheck: called')
        if (Memory.creeps === undefined) { Memory.creeps = {} }
        if (Memory.spawns === undefined) { Memory.spawns = {} }
        if (Memory.rooms  === undefined) { Memory.rooms = {} }
        if (Memory.flags  === undefined) { Memory.flags = {} }

        if (Memory.MY_USERNAME === undefined) { Memory.MY_USERNAME = Game.spawns[Object.keys(Game.spawns)[0]].owner.username }
        // if (Memory.jobs === undefined) { Memory.jobs = {} }
        // if (Memory.jobs.contracts === undefined) { Memory.jobs.contracts = {} }
        // if (Memory.jobs.kind === undefined) { Memory.jobs.kind = {} }
        // Memory.jobs.createdThisTick = 0
        Memory.spawns.spawnnedThisTick = 0

        if (Memory.IN_SIMULATION_ROOM === undefined) {
            var isInSimulationRoom = false
            for (let hash in Game.rooms) {
                // console.log('room hash', hash)
                // let room = Game.rooms[hash]
                if (hash == 'sim') { isInSimulationRoom = true; break }
            }
            Memory.IN_SIMULATION_ROOM = isInSimulationRoom
        }
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
}

module.exports = utility;
