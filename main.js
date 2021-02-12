var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDoctor = require('role.doctor');
var roleManual = require('role.manual');

var creepRoleBalance = require('creep.roleBalance');
var creepPopulationControl = require('creep.populationControl');
var creepMemoryManagement = require('creep.memoryManagement');

var towerBasics = require('tower.basics');

module.exports.loop = function () {

    // if (Game.time % 7 == 0) {
    //     console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    // }

    // console.log('main: ✅ Current game time is: ' + Game.time + ' --------------------------------------------------')
    // console.log('test sync 3')
    var numberFormatter = Intl.NumberFormat('en-US')
    var stats = ("✅ Tick: " + Game.time + " ---------------------------------------------------------------------\n")
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n')
    stats += ('Shard: ' + Game.shard.name + ', ptr = ' + Game.shard.ptr + '\n')
    stats += ('Flags: ' + Object.keys(Game.flags).length + '\n')
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n')
    stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n')
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n')
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n')
    stats += ('Memory: ' + numberFormatter.format(RawMemory.get().length) + ' bytes\n')

    console.log(stats)

    let spawn = Game.spawns['Spawn1']
    let room = spawn.room
    var startCpuTime = 0
    if (room.name == 'sim') {
        startCpuTime = performance.now()
    }

    creepRoleBalance.trySpawn(spawn)
    creepRoleBalance.balanceBuilderUpgrader(room)
    creepRoleBalance.balanceUpgraderHarvester(room)

    towerBasics.run(room)

    creepMemoryManagement.run()
    creepPopulationControl.check()

    // creepPopulationControl.check.balance()

    // console.log('sync test 11')

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.spawning) { return }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'doctor') {
            roleDoctor.run(creep)
        }
        if (creep.memory.role == 'manual') {
            roleManual.run(creep)
        }
    }

    if (room.name == 'sim') {
        let finalCpuTime = performance.now()
        let deltaCpuTime = finalCpuTime - startCpuTime
        console.log('⏺Finished execution in ' + numberFormatter.format(1000 * deltaCpuTime) + 'ns\n\n')
    } else {
        console.log('⏺Finished execution and used', Game.cpu.getUsed().toFixed(3), 'CPU. \n')

    }
    // console.clear();
    // console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")

}
