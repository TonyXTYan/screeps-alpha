var utility = {

    // resetMemory: function() {
        // console.log('💣 Reset Memeory Called!')

        // let default = {"creeps":{},"spawns":{},"rooms":{},"flags":{}}
        // RawMemory.set("{'creeps':{},'spawns':{},'rooms':{},'flags':{}}");
        // Memory = JSON.parse(RawMemory.get());
        // RawMemory.

        // Memory.creeps = {}

        // RawMemory.set("{}");
        //
        // Memory.creeps = {};
        // Memory.spawns = {};
        // Memory.rooms = {};
        // Memory.flags = {};
    // },

    initialSetupEnvironmentCheck: function() {
        for(var name in Game.rooms) {
            let room = Game.rooms[name]
            // console.log(room)
            utility.initialSetupEnvironmentCheckForRoom(room)
        }
    },

    initialSetupEnvironmentCheckForRoom: function(room) {
        if (room.memory.sourceChecked === undefined) {
            utility.computeSourcePropertyInRoom(room)
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
    }
}

module.exports = utility;

// Object.assign(exports, {
//     // ROOM_WIDTH: 50,
//     // ROOM_HEIGHT: 50,
//     // ROOM_WIDTH_INDEX_MAX: 49,
//     // ROOM_HEIGHT_INDEX_MAX: 49,
//
//     // SOURCE_PROPERTY_CHECKED: 1000
//
//     // TERRAIN_WALL: 'wall',
//     // TERRAIN_PLAIN: 'plain'
//
// })
