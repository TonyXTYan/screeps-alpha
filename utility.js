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
        // for(var name in Game.rooms) {
        //     let room = Game.rooms[name]
        //     // console.log(room)
        //     utility.initialSetupEnvironmentCheckForRoom(room)
        // }
    },

    initialSetupEnvironmentCheckForRoom: function(room) {
        console.log('utility.initialSetupEnvironmentCheckForRoom: called')
        if (room.memory.sourceChecked === undefined) {
            utility.computeSourcePropertyInRoom(room)
        } else if (room.memory.sourceChecked + 3 < Game.time) { //FIXME: schedule
            utility.computeSourcePropertyInRoom(room)
        }

        if (Memory.myUsername === undefined) {
            // console.log(Game.spawns[Object.keys(Game.spawns)[0]])
            Memory.myUsername = Game.spawns[Object.keys(Game.spawns)[0]].owner.username
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

        room.memory.source = {}
        for (name in sources) {
            let source = sources[name]
            let result = calculate(source)
            // console.log(result)s
            let spaceCounter = result[0]
            let containersNearby = result[1]
            // console.log(source + ' at ' + source.pos + ' has space ' + freeSpace)
            room.memory.source[source.id] = { spaceCounter: spaceCounter, containersNearby: containersNearby }
        }
        room.memory.sourceChecked = Game.time
    },

    resetMemory: function() {

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
    }

}

module.exports = utility;
