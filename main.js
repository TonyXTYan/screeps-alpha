var utility = require('utility');
var creepController = require('creep.controller');
var contractScheduler = require('contract.scheduler');
var spawnController = require('spawn.controller');

module.exports.loop = function () {
    // if (Game.time % 3 == 0) {
    //     console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    // }

    var numberFormatter = Intl.NumberFormat('en-US')
    var stats = ("✅ Tick: " + Game.time + " ---------------------------------------------------------------------\n")
    let startCpuTime = performance.now()
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n')
    // stats += ('Flags: ' + Object.keys(Game.flags).length + '\n')
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n')
    stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n')
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n')
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n')
    stats += ('Memory: ' + numberFormatter.format(RawMemory.get().length) + ' bytes\n')

    console.log(stats)


    // let spawn = Game.spawns['Spawn1']
    // let room = spawn.room

    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
    // }


    contractScheduler.run()
    utility.initialSetupEnvironmentCheck()

    for(var name in Game.spawns) {
        let spawn = Game.spawns[name]
        spawnController.run(spawn)
    }





    let finalCpuTime = performance.now()
    let deltaCpuTime = finalCpuTime - startCpuTime
    console.log('⏺Finished execution in ' + numberFormatter.format(1000 * deltaCpuTime) + 'ns\n\n')
}
