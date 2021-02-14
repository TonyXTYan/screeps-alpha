var CONSTANTS = require('constants')

var utility = {

    performanceProfile: function(func, n = 1) {
        var startCpuTime = Game.cpu.getUsed()
        if (Memory.IN_SIMULATION_ROOM) {
            startCpuTime = performance.now()
        }
        for (var i = 0; i < n; i++) {
            func()
        }
        var endCpuTime = Game.cpu.getUsed()
        if (Memory.IN_SIMULATION_ROOM) {
            endCpuTime = performance.now()
            let delta = endCpuTime - startCpuTime
            console.log('utility: performanceProfile: measured ' + utility.numberFormatter.format(delta) + ' ms.' )
        } else {
            let delta = endCpuTime - startCpuTime
            console.log('utility: performanceProfile: measured ' + delta.toFixed(3) + ' CPUs.' )
        }
    },

    numberFormatter: Intl.NumberFormat('en-US'),

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

    lookAroundPosFor: function(pos, structureType, delta = 1) {
        // let pos = source.pos
        // console.log('utility.computeSourcePropertyInRoom: called', pos, structure)
        let room = Game.rooms[pos.roomName]
        let lookResult = room.lookForAtArea(LOOK_TERRAIN, Math.max(0,  pos.y-delta), Math.max(0,  pos.x-delta)
                                                        , Math.min(49, pos.y+delta), Math.min(49, pos.x+delta), true)
        var reachableSpaceCounter = 0
        var structureNearby = []
        for (let index in lookResult) {
            let item = lookResult[index]
            // console.log('(' + item.x + ', ' + item.y + ') is ' + item.terrain)
            if ((item.x == pos.x && item.y == pos.y)) { continue } // not equal to source.pos
            else {
                if (item.terrain != 'wall') { reachableSpaceCounter++ }
                // console.log(room.lookForAt(LOOK_STRUCTURES, item.x, item.y)[0].structure.structureType == STRUCTURE_CONTAINER)
                let found = room.lookForAt(LOOK_STRUCTURES, item.x, item.y)
                // console.log(found)
                for (let index_found in found) {
                    let structure = found[index_found]
                    // console.log(structure, structure.structureType, structureType == structureType)
                    if (structure.structureType == structureType) {
                        structureNearby.push(structure.id)
                    }
                }

            }
        }
        return [reachableSpaceCounter, structureNearby]
    },

    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        if (room.memory.sources === undefined) { room.memory.sources = {} }
        if (room.memory.containers === undefined) { room.memory.containers = {} }

        for (name in sources) {
            let source = sources[name]
            let result = utility.lookAroundPosFor(source.pos, STRUCTURE_CONTAINER)
            let spaceCounter = result[0]
            let containersNearby = result[1]
            // console.log(source + ' at ' + source.pos, spaceCounter, 'and', containersNearby)
            if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
            room.memory.sources[source.id].spaceCounter = spaceCounter
            room.memory.sources[source.id].containersNearby = containersNearby

            for (let index in containersNearby) {
                let containerId = containersNearby[index]
                let container = Game.getObjectById(containerId)
                // console.log(container)
                let result = utility.lookAroundPosFor(container.pos, STRUCTURE_LINK)
                // console.log(container, result[1])
                if (room.memory.containers[container.id] === undefined) { room.memory.containers[container.id] = {} }
                room.memory.containers[container.id].linksNearby = result[1]
            }

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



    // /**
    //  * balanceSpec - Try to balance the specification given with given energy levels
    //  *
    //  * @param  {type} spec   description
    //  * @param  {type} energy description
    //  * @return {type}        description
    //  */
    // balanceSpec: function(spec, energy) {
    //     // var sum = spec.reduce((a, b) => a + b, 0)
    //     const bodyPartName = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
    //     const bodyPartCost = [50,   100,  50,    80,     150,           250,  600,   10   ]
    //
    //     var weighted = []
    //     var weightedSum = 0
    //     for (i in spec){
    //         var c = spec[i] * bodyPartCost[i]
    //         weighted[i] = c
    //         weightedSum += c
    //     }
    //     var scale = energy / weightedSum
    //
    //     var parts = []
    //     for (i in spec) {
    //         var count = Math.floor(weighted[i] * scale / bodyPartCost[i])
    //         for (c in Array(count).fill(0)) {
    //             parts.push(bodyPartName[i])
    //         }
    //     }
    //     return parts
    // },

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
    },
}

module.exports = utility;
