var CONSTANT = require('constant')

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
        for (let name in Game.rooms) {
            let room = Game.rooms[name]
            func(room)
        }
    },

    runForAllCreeps: function(func) {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name]
            func(creep)
        }
    },

    runForAllSpawns: function(func) {
        for (let name in Game.spawns) {
            let spawn = Game.spawns[name]
            func(spawn)
        }
    },

    runForAllFlags: function(func) {
        for (let name in Game.flags) {
            let flag = Game.flags[name]
            func(flag)
        }
    },

    memorySetup: function() {
        // if (Memory.memorySetup.utility && (!force)) { return }
        utility.basicMemoryCheck()
    },

    lookAroundPosFor: function(pos, structureType, delta = 1) {
        // let pos = source.pos
        // console.log('utility.lookAroundPosFor: called', pos, structureType)
        let room = Game.rooms[pos.roomName]
        let lookResult = room.lookForAtArea(LOOK_TERRAIN, Math.max(0,  pos.y-delta), Math.max(0,  pos.x-delta)
                                                        , Math.min(49, pos.y+delta), Math.min(49, pos.x+delta), true)
        var reachableSpaceCounter = 0
        var structuresNearby = []
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
                    if (structure.structureType == structureType) {
                        structuresNearby.push(structure.id)
                    }
                }

            }
        }
        return {freeSpaceCount: reachableSpaceCounter, structuresNearby: structuresNearby}
    },



    totalSourceSpots: function(room) {
        var total = 0
        for(let id in room.memory.sources) {
            total += room.memory.sources[id].spaceCounter
        }
        return total
    },

    memoryTickReset: function() {
         Memory.spawns.spawnnedThisTick = 0
    },

    resetMemory: function() {
        console.log('💣💣💣💣💣utility.resetMemory: called')
        for (let key in Memory) {
            Memory[key] = undefined
        }
        utility.memorySetup()
        // Memory.taskManager = undefined
        console.log('💥💥💥💥💥utility.resetMemory: finished')
    },

    basicMemoryCheck: function() {
        console.log('utility.basicMemoryCheck: called')
        if (Memory.creeps === undefined) { Memory.creeps = {} }
        if (Memory.spawns === undefined) { Memory.spawns = {} }
        if (Memory.rooms  === undefined) { Memory.rooms = {} }
        if (Memory.flags  === undefined) { Memory.flags = {} }


        utility.runForAllCreeps(creep => creep.memory)
        utility.runForAllSpawns(spawn => {
            // console.log(spawn)
            spawn.memory
            spawn.memory.pathTo = {}
            // spawn.memory.queue = {}
        })
        utility.runForAllFlags(flag => flag.memory)
        utility.runForAllRooms(room => {
            room.memory
            room.memory.creepSpawnJointQueue = {}
            room.memory.creepRenewJointQueue = {} // TODO: check if needed
            room.memory.creepDesignated = {}
            room.memory.sources = {}
            room.memory.controller = {}
            room.memory.storages = {}
            room.memory.links = {}
            room.memory.containers = {}
            room.memory.roads = {}
        })

        for (let key in Memory.creeps) { if (Game.creeps[key] === undefined) { Memory.creeps[key] = undefined } }
        for (let key in Memory.spawns) { if (Game.spawns[key] === undefined) { Memory.spawns[key] = undefined } }
        for (let key in Memory.flags) { if (Game.flags[key] === undefined) { Memory.flags[key] = undefined } }

        // if (Memory.jobs === undefined) { Memory.jobs = {} }
        // if (Memory.jobs.contracts === undefined) { Memory.jobs.contracts = {} }
        // if (Memory.jobs.kind === undefined) { Memory.jobs.kind = {} }
        // Memory.jobs.createdThisTick = 0
        if (Memory.colony === undefined) { Memory.colony = {} }

        if (Memory.taskManager === undefined) { Memory.taskManager = {} }
        if (Memory.taskManager.memory === undefined)           { Memory.taskManager.memory = {} }
        if (Memory.taskManager.memory.checked === undefined)   { Memory.taskManager.memory.checked = {} }
        if (Memory.taskManager.memory.needAudit === undefined) { Memory.taskManager.memory.needAudit = {} }
        if (Memory.taskManager.memory.cost === undefined)      { Memory.taskManager.memory.cost = {} }
        // if (Memory.taskManager.memoryCheckCost === undefined) { Memory.taskManager.memoryCheckCost = {} }
        // if (Memory.taskManager.memoryAudit === undefined) { Memory.taskManager.memoryAudit = {} }

        if (Memory.spawns.spawnnedThisTick === undefined) { Memory.spawns.spawnnedThisTick = 0 }

        if (Memory.MY_USERNAME === undefined) { Memory.MY_USERNAME = Game.spawns[Object.keys(Game.spawns)[0]].owner.username }
        if (Memory.DEBUG === undefined) { Memory.DEBUG = true }
        // if (Memory.memorySetup === undefined) { Memory.memorySetup = { utility: Game.time } }
        // if (Memory.memoryAudit === undefined) { Memory.memoryAudit = {} }

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
