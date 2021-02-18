var utility = require('utility');
var colonyDirector = require('colony.director');
var colonyManager = require('colony.manager');
var roomManager = require('room.manager');
var creepManager = require('creep.manager');
var spawnExecution = require('spawn.execution');
var CONSTANT = require('constant')
var RETURN = CONSTANT.RETURN

var test = require('test');

const CPU_TASK = {
    EVERY_TICK: { // routine checks
        // STATS: utility.printStats,
        UTILITY: utility.memoryTickReset,
        // TEST: test.run,
    },

    MANAGEMENT: {
        ROOM_MGR: {
            RUN: roomManager.manage,
            RECOMPUTE_FREQ: CONSTANT.FREQ_MID,
        },
    },

    EXECUTION: {
        SPAWN: spawnExecution.run,
    },

    MEMORY: { // setup and check the memory
        // UTILITY: utility,
        // COLONY_MGR: colonyManager,
        // COLONY_DIR: colonyDirector,
        // ROOM_MGR: roomManager,
        // CREEP_MGR: creepManager,

        UTILITY: {
            CHECK: utility.memorySetup,
            AUDIT: utility.memoryAudit,
            // RECHECK_FREQ: CONSTANT.FREQ_VERY_LOW,
            RECOMPUTE_FREQ: CONSTANT.FREQ_LOW,
        },
        COLONY_MGR: {
            CHECK: colonyManager.memoryCheck,
            // RECHECK_FREQ: CONSTANT.FREQ_VERY_LOW,
            RECOMPUTE_FREQ: CONSTANT.FREQ_LOW,
        },
        COLONY_DIR: {
            CHECK: colonyDirector.memoryCheck,
            // RECHECK_FREQ: CONSTANT.FREQ_VERY_LOW,
            RECOMPUTE_FREQ: CONSTANT.FREQ_LOW,
        },
        ROOM_MGR: {
            CHECK: roomManager.memoryCheck,
            // RECHECK_FREQ: CONSTANT.FREQ_VERY_LOW,
            AUDIT: roomManager.memoryAuditCheck,
            RECOMPUTE_FREQ: CONSTANT.FREQ_LOW,
        },
        CREEP_MGR: {
            CHECK: creepManager.memoryCheck,
            // RECHECK_FREQ: CONSTANT.FREQ_VERY_LOW,
            RECOMPUTE_FREQ: CONSTANT.FREQ_MID,
        },
    },
}

var cpuTaskManager = {
    run: function () {
        // DEBUGGING
        // Memory.taskManager.memoryAudit.ROOM_MGR = 0
        // Memory.taskManager.memoryAudit.UTILITY = 0
        // Memory.taskManager.management.needRecompute.ROOM_MGR = 0


        cpuTaskManager.everyTickTasks()
        cpuTaskManager.memoryCheckTasks()
        cpuTaskManager.managementTasks()
        // cpuTaskManager.midFreqTasks()
    },

    everyTickTasks: function() {
        for (let name in CPU_TASK.EVERY_TICK) {
            let func = CPU_TASK.EVERY_TICK[name]
            func()
        }

        for (let name in CPU_TASK.EXECUTION) {
            CPU_TASK.EXECUTION[name]()
        }
    },

    // midFreqTasks: function() {
    //     if (Game.time % CONSTANT.FREQ_LOW == utility.getRandomInt(-2,2)) {
    //         for (let name in CPU_TASK.MEMORY) {
    //             let obj = CPU_TASK.MEMORY[name]
    //             let audit = CPU_TASK.MEMORY[name].AUDIT
    //             if (audit) { audit() }
    //         }
    //     }
    // },

    managementTasks: function() {
        for (let name in CPU_TASK.MANAGEMENT) {
            // if (Game.time % CONSTANT.FREQ_MID == utility.getRandomInt(-2,2)) {
            if (Memory.taskManager.management.called[name] === undefined ||
                Memory.taskManager.management.needRecompute[name] < Game.time ) {
                // Memory.taskManager.management.called[name] + CONSTANT.FREQ_LOW + utility.getRandomInt(-2,2) < Game.time ) {
                let a = Game.cpu.getUsed()
                let obj = CPU_TASK.MANAGEMENT[name]
                obj.RUN()
                let b = Game.cpu.getUsed()
                Memory.taskManager.management.called[name] = Game.time
                Memory.taskManager.management.cost[name] = b - a
                Memory.taskManager.management.needRecompute[name] = Game.time + obj.RECOMPUTE_FREQ + utility.getRandomInt(0, 10)
            }
            // }
        }
    },

    memoryCheckTasks: function() {

        for (let name in CPU_TASK.MEMORY) {
            let obj = CPU_TASK.MEMORY[name]
            if (obj.AUDIT && Memory.taskManager.memory.needRecompute - obj.RECOMPUTE_FREQ * 0.5 < Game.time) {
                let code = obj.AUDIT()
                switch (code) {
                    case RETURN.EXTEND_VALID_TIME: Memory.taskManager.memory.needRecompute + obj.RECOMPUTE_FREQ; break
                    default: console.log('cpuTaskManager.memoryCheckTasks: code ' + code); break
                }
            }

            if (Memory.taskManager.memory.called[name] === undefined ||
                Memory.taskManager.memory.needRecompute[name] < Game.time ) {
                // Memory.taskManager.memory.called[name] + CONSTANT.FREQ_VERY_LOW + utility.getRandomInt(-10,10) < Game.time ) {
                let a = Game.cpu.getUsed()
                obj.CHECK()
                let b = Game.cpu.getUsed()
                // console.log(b - a)
                Memory.taskManager.memory.called[name] = Game.time
                Memory.taskManager.memory.cost[name] = b - a
                // if (Memory.IN_SIMULATION_ROOM) { Memory.taskManager.memory.cost[name] = utility.getRandomInt(1,10) }
                Memory.taskManager.memory.needRecompute[name] = Game.time + obj.RECOMPUTE_FREQ + utility.getRandomInt(0, 10)
            }
        }
    },

}
module.exports = cpuTaskManager
