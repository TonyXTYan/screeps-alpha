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
        }
        if (Memory.myUsername === undefined) {
            // console.log(Game.spawns[Object.keys(Game.spawns)[0]])
            Memory.myUsername = Game.spawns[Object.keys(Game.spawns)[0]].owner.username
        }
    },


    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        function getFreeSpace(source) {
            let pos = source.pos

            let lookResult = room.lookForAtArea(LOOK_TERRAIN, Math.max(0,  pos.y-1), Math.max(0,  pos.x-1)
                                                            , Math.min(49, pos.y+1), Math.min(49, pos.x+1), true)
            var spaceCounter = 0
            for (let index in lookResult) {
                let item = lookResult[index]
                // console.log('(' + item.x + ', ' + item.y + ') is ' + item.terrain)
                if (!(item.x == source.pos.x && item.y == source.pos.y) &&
                     (item.terrain != 'wall')) {
                    // console.log('here')
                    spaceCounter++
                } else { continue }
            }
            return spaceCounter

        }

        room.memory.source = {}
        for (name in sources) {
            let source = sources[name]
            let freeSpace = getFreeSpace(source)
            // console.log(source + ' at ' + source.pos + ' has space ' + freeSpace)
            room.memory.source[source.id] = freeSpace
        }
        room.memory.sourceChecked = Game.time
    },

    resetMemory: function() {

    }

}

module.exports = utility;
