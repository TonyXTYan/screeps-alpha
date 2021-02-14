var utility = require('utility');
var jobScheduler = require('job.scheduler');
var jobAllocator = require('job.allocator');
// var jobContract = require('job,contract')
var jobUtility = require('job.utility')
var spawnController = require('spawn.controller');
var creepController = require('creep.controller');
var CONSTANTS = require('constants');
// var newFile = require('folder_newFile');

module.exports.loop = function () {
    // if (Game.time % 5 == 0) {
    //     console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    // }
    // console.log(Memory.IN_SIMULATION_ROOM)
    var startCpuTime = 0
    if (Memory.IN_SIMULATION_ROOM) {
        startCpuTime = performance.now()
    }
    require('version') // SCRIPT_VERSION is in here
    if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
        let oldTimestamp = new Date(Memory.SCRIPT_VERSION)
        // let newTimestamp = new Date(SCRIPT_VERSION)
        Memory.SCRIPT_VERSION = SCRIPT_VERSION
        console.log('REPLACING OLD VERSION FROM', oldTimestamp)
        console.log(CONSTANTS.BANNER.CODE_UPDATED)
    }

    var numberFormatter = Intl.NumberFormat('en-US');
    var stats = ('✅ Tick: ' + Game.time + ' script: ' + Memory.SCRIPT_VERSION + ' ----------------------------------\n');
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n');
    stats += ('Shard: ' + Game.shard.name + ', ptr = ' + Game.shard.ptr + ', branch: grunt\n')
    // stats += ('Flags: ' + Object.keys(Game.flags).length + '\n');
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n');
    // stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n');
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n');
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n');
    stats += ('Jobs: ' + jobUtility.jobCount().all + '\n');
    stats += ('Memory: ' + numberFormatter.format(RawMemory.get().length) + ' bytes\n');

    console.log(stats)

    if (Game.cpu.bucket >= 10000) { // FIXME: move to task manager
        console.log('Game.cpu.generatePixel: returned ' + Game.cpu.generatePixel());
    }

    // setup
    utility.initialSetupEnvironmentCheck();

    // execution
    spawnController.run();
    creepController.run();

    // schedule and allocation
    jobScheduler.run();
    jobAllocator.run();



    if (Memory.IN_SIMULATION_ROOM) {
        let finalCpuTime = performance.now()
        let deltaCpuTime = finalCpuTime - startCpuTime
        console.log('⏺Finished execution in ' + numberFormatter.format(1000 * deltaCpuTime) + 'ns\n\n')
    } else {
        console.log('⏺Finished execution and used', Game.cpu.getUsed().toFixed(3), 'CPU. \n')
    }
};
