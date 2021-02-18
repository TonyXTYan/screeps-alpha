var utility = require('utility');
var colonyDirector = require('colony.director');
var colonyManager = require('colony.manager');
var roomManager = require('room.manager');
var creepManager = require('creep.manager');
var CONSTANT = require('constant')

const CPU_TASK = {
    EVERY_TICK: { // routine checks
        UTILITY: utility.memoryTickReset,
    },

    MANAGEMENT: {
        ROOM: roomManager.manage,
    },

    MEMORY: { // setup and check the memory
        // UTILITY: utility,
        // COLONY_MGR: colonyManager,
        // COLONY_DIR: colonyDirector,
        // ROOM_MGR: roomManager,
        // CREEP_MGR: creepManager,

        UTILITY: {
            CHECK: utility.memorySetup,
        },
        COLONY_MGR: {
            CHECK: colonyManager.memoryCheck,
        },
        COLONY_DIR: {
            CHECK: colonyDirector.memoryCheck,
        },
        ROOM_MGR: {
            CHECK: roomManager.memoryCheck,
            AUDIT: roomManager.memoryAuditCheck,
        },
        CREEP_MGR: {
            CHECK: creepManager.memoryCheck,
        },
    },
}

var cpuTaskManager = {
    run: function () {
        cpuTaskManager.everyTickTasks()
        cpuTaskManager.memoryCheckTasks()
        cpuTaskManager.managementTasks()
        cpuTaskManager.midFreqTasks()
    },

    everyTickTasks: function() {
        for (let name in CPU_TASK.EVERY_TICK) {
            let func = CPU_TASK.EVERY_TICK[name]
            func()
        }
    },

    midFreqTasks: function() {
        if (Game.time % CONSTANT.FREQ_MID == utility.getRandomInt(-2,2)) {
            for (let name in CPU_TASK.MEMORY) {
                let obj = CPU_TASK.MEMORY[name]
                let audit = CPU_TASK.MEMORY[name].AUDIT
                if (audit) { audit() }
            }
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
        for (let name in CPU_TASK.MEMORY) {
            let obj = CPU_TASK.MEMORY[name]
            if (Memory.taskManager.memory.checked[name] === undefined ||
                Memory.taskManager.memory.needAudit[name] < Game.time) {
                    let a = Game.cpu.getUsed()
                    obj.CHECK()
                    let b = Game.cpu.getUsed()
                    // console.log(b - a)
                    Memory.taskManager.memory.checked[name] = Game.time
                    Memory.taskManager.memory.cost[name] = b - a
                    // if (Memory.IN_SIMULATION_ROOM) { Memory.taskManager.memory.cost[name] = utility.getRandomInt(1,10) }
                    Memory.taskManager.memory.needAudit[name] = undefined
                } else { continue }
            }
    },

}
module.exports = cpuTaskManager
