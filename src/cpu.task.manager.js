var utility = require('utility');
var colonyDirector = require('colony.director');
var colonyManager = require('colony.manager');
var roomManager = require('room.manager');
var creepManager = require('creep.manager');

const CPU_TASK = {
    EVERY_TICK: { // routine checks
        UTILITY: utility.memoryTickReset,
    },

    MANAGEMENT: {
        ROOM: roomManager.manage,
    },

    MEMORY_CHECK: { // setup and check the memory
        UTILITY: utility.memorySetup,
        COLONY_MGR: colonyManager.memoryCheck,
        COLONY_DIR: colonyDirector.memoryCheck,
        ROOM_MGR: roomManager.memoryCheck,
        CREEP_MGR: creepManager.memoryCheck,
    },
}

var cpuTaskManager = {
    run: function () {
        cpuTaskManager.everyTickTasks()
        cpuTaskManager.memoryCheckTasks()
        cpuTaskManager.managementTasks()
    },

    everyTickTasks: function() {
        for (let name in CPU_TASK.EVERY_TICK) {
            let func = CPU_TASK.EVERY_TICK[name]
            func()
        }
    },

    managementTasks: function() {
        for (let name in CPU_TASK.MANAGEMENT) {
            let func = CPU_TASK.MANAGEMENT[name]
            func()
        }
    },

    memoryCheckTasks: function() {
        // DEBUGGING
        // Memory.taskManager.memoryAudit.ROOM_MGR = 0
        // Memory.taskManager.memoryAudit.UTILITY = 0
        for (let name in CPU_TASK.MEMORY_CHECK) {
            let func = CPU_TASK.MEMORY_CHECK[name]
            if (Memory.taskManager.memoryCheck[name] === undefined ||
                Memory.taskManager.memoryAudit[name] !== undefined) {
                    func()
                    Memory.taskManager.memoryCheck[name] = Game.time
                    Memory.taskManager.memoryAudit[name] = undefined
                } else { continue }
            }
    },

}
module.exports = cpuTaskManager
