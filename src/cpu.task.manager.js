var utility = require('utility');
var colonyDirector = require('colony.director');
var colonyManager = require('colony.manager');
var roomManager = require('room.manager');

const CPU_TASK = {
    everyTick: utility.memoryTickReset,
    // colony

    MEMORY_CHECK: {
        utility: utility.memorySetup,
        roomManager: roomManager.memoryCheck,
        colonyManager: colonyManager.memoryCheck,
        colonyDirector: colonyDirector.memoryCheck,
    },
}

var cpuTaskManager = {
    run: function () {
        CPU_TASK.everyTick()

        // DEBUGGING ONLY
        // Memory.taskManager.memoryAudit.roomManager = 0



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
