var utility = require('utility');
var jobScheduler = require('job.scheduler');
var jobAllocator = require('job.allocator');
var jobUtility = require('job.utility')
var spawnController = require('spawn.controller');
var creepController = require('creep.controller');
var newFile = require('folder_newFile');

module.exports.loop = function () {
    // if (Game.time % 5 == 0) {
    //     console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    // }

    var numberFormatter = Intl.NumberFormat('en-US')
    var stats = ("✅ Tick: " + Game.time + " -----------------------------2------------------------------------4----\n")
    let startCpuTime = performance.now()
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n')
    // stats += ('Flags: ' + Object.keys(Game.flags).length + '\n')
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n')
    // stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n')
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n')
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n')
    stats += ('Jobs: ' + jobUtility.jobCount().all + '\n')
    stats += ('Memory: ' + numberFormatter.format(RawMemory.get().length) + ' bytes\n')

    console.log(stats)
    newFile.run()

    if (Game.cpu.bucket >= 10000) { // FIXME: move to task manager
        console.log('Game.cpu.generatePixel: returned ' + Game.cpu.generatePixel())
    }
    // setup
    utility.initialSetupEnvironmentCheck()

    // schedule and allocation
    jobScheduler.run()
    jobAllocator.run()

    // execution
    spawnController.run()
    creepController.run()


    // require('version')
    // if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
    //     Memory.SCRIPT_VERSION = SCRIPT_VERSION
    //     console.log('New code uplodated')
    // }


    let finalCpuTime = performance.now()
    let deltaCpuTime = finalCpuTime - startCpuTime
    // console.log('⏺Finished execution')
    console.log('⏺Finished execution in ' + numberFormatter.format(1000 * deltaCpuTime) + 'ns\n\n')
}
