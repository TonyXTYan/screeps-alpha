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

    // console.log('main: ✅ Current game time is: ' + Game.time + ' -------------------------------')
    // console.log('test sync 3')
    var numberFormatter = Intl.NumberFormat('en-US')
    var stats = ("✅ Tick: " + Game.time + " ---------------------------------------------------------------------\n")
    // let startCpuTime = performance.now()
    stats += ('CPU tickLimit: ' + Game.cpu.tickLimit + ', bucket: ' + Game.cpu.bucket + '\n')
    stats += ('Flags: ' + Object.keys(Game.flags).length + '\n')
    stats += ('Creeps: ' + Object.keys(Game.creeps).length + '\n')
    stats += ('Spawns: ' + Object.keys(Game.spawns).length + '\n')
    stats += ('Structures: ' + Object.keys(Game.structures).length + '\n')
    stats += ('Constructions: ' + Object.keys(Game.constructionSites).length + '\n')
    stats += ('Memory: ' + numberFormatter.format(RawMemory.get().length) + ' bytes\n')

    console.log(stats)
    if (Game.cpu.bucket >= 10000) {
        console.log('Generate a Pixel returns: ' + Game.cpu.generatePixel())
    }

    let spawn = Game.spawns['Spawn1']
    let room = spawn.room

    creepRoleBalance.trySpawn(spawn)
    creepRoleBalance.balanceBuilderUpgrader(room)
    creepRoleBalance.balanceUpgraderHarvester(room)

    towerBasics.run(room)

    creepMemoryManagement.run()
    creepPopulationControl.check()

    // creepPopulationControl.check.balance()

    // console.log('sync test 1')

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

    // console.clear();

}
