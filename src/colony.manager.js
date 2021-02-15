var utility = require('utility');
var roomManager = require('room.manager');
const CONSTANT = require('constant')


const QUARANTINED = "quarantined"


var colonyManager = {
    run: function() {
        // if (Memory.ini)
        colonyManager.memoryCheck()
        colonyManager.runForAllColonies(colonyManager.runColony)
    },

    runColony: function(rooms) {
        for (let index in rooms){
            let room = Game.rooms[rooms[index]]
            // console.log(name, room)
        }

    },

    runForAllColonies: function(func) {
        for (let name in Memory.colony) {
            let roomList = Memory.colony[name]
            // console.log(name, roomList)
            func(roomList)
        }
    },

    memoryCheck: function() {
        // if (Memory.memorySetup.colonyManager) { return }
        if (Memory.colonyMa === undefined) { Memory.colony = {} }
        utility.runForAllRooms(colonyManager.memoryCheckForRoom)
        // Memory.memorySetup.colonyManager = Game.time
    },

    memoryCheckForRoom: function(room) {
        if (room.memory.colony === undefined) { room.memory.colony = QUARANTINED }
        if (Memory.colony[room.memory.colony] === undefined) { Memory.colony[room.memory.colony] = [] }
        Memory.colony[room.memory.colony].push(room.name)
    },

}
module.exports = colonyManager
