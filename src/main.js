var CONSTANT = require('constant');
var utility = require('utility');
var cpuTaskManager = require('cpu.task.manager');
// var newFile = require('folder_newFile');

module.exports.loop = function () {
    // if (Game.time % 5 == 0) {
    //     console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    // }
    var startCpuTime = 0
    if (Memory.IN_SIMULATION_ROOM) {
        // 20 ms is about 20 CPU
        startCpuTime = performance.now()
    }
    require('version') // SCRIPT_VERSION is in here
    if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
        let oldTimestamp = new Date(Memory.SCRIPT_VERSION)
        console.log('REPLACING OLD VERSION FROM', oldTimestamp)
        utility.resetMemory()
        Memory.SCRIPT_VERSION = SCRIPT_VERSION
        Memory.SCRIPT_VERSION_TICK = Game.time
        console.log(CONSTANT.BANNER.CODE_UPDATED)
    }



    var stats = ('\n✅ Tick: ' + Game.time + ' script: ' + Memory.SCRIPT_VERSION + ' ----------------------------------\n');
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n');
    stats += ('Shard: ' + Game.shard.name + ', ptr = ' + Game.shard.ptr + ', branch: grunt\n')
    // stats += ('Flags: ' + Object.keys(Game.flags).length + '\n');
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n');
    stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n');
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n');
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n');
    // stats += ('Jobs: ' + jobUtility.jobCount().all + '\n');
    stats += ('Memory: ' + utility.numberFormatter.format(RawMemory.get().length) + ' bytes\n');


    console.log(stats)

    // if (Game.cpu.bucket >= 10000) { // FIXME: move to task manager
    //     console.log('Game.cpu.generatePixel: 🟥 returned ' + Game.cpu.generatePixel());
    // }

    cpuTaskManager.run()

    // utility.initialSetupEnvironmentCheck();

    function testing() {
        // utility.runForAllRooms(utility.computeSourcePropertyInRoom)
        // let spawn = Game.spawns['Spawn1']
        // let result = utility.lookAroundPosFor(spawn.pos, STRUCTURE_STORAGE, 10)
        // console.log(result)

        utility.basicMemoryCheck()
    }
    // utility.performanceProfile(testing, 1000*1000)


    if (Memory.IN_SIMULATION_ROOM) {
        let finalCpuTime = performance.now()
        let deltaCpuTime = finalCpuTime - startCpuTime
        console.log('⏺Finished execution in ' + utility.numberFormatter.format(deltaCpuTime) + ' ms')
    } else {
        console.log('⏺Finished execution and used', Game.cpu.getUsed().toFixed(3), 'CPU.')
    }
};
