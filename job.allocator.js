var utility = require('utility')
var CONSTANTS = require('constants')


var jobAllocator = {
    run: function() {
        // if (Game.time % CONSTANTS.FREQ_HIGH = 1) {
            jobAllocator.allocateCreeps.run()
            jobAllocator.spawnsRelated.run()
        // }
    },

    allocateCreeps: {
        run: function() {
            utility.runForAllRooms(jobAllocator.allocateCreeps.checkRoom)
        },
        checkRoom: function(room){
            console.log('jobAllocator.allocateCreeps: on room ' + room.name)
            let creeps = room.find(FIND_MY_CREEPS)
            console.log(creeps)

        },s
    },

    spawnsRelated: {
        run: function() {
            for (i in Game.spawns) {
                jobAllocator.spawnsRelated.checkSpawn(Game.spawns[i])
            }
        },

        checkSpawn: function(spawn) {
            console.log(spawn)
            

        }

    },

}

module.exports = jobAllocator


// var job
