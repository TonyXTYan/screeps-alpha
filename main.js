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

    if (Game.time % 7 == 0) {
        console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")
    }

    console.log('main: ✅ Current game time is: ' + Game.time + ' --------------------------------------------------')
    // console.log('test sync 3')

    let spawn = Game.spawns['Spawn1']
    let room = spawn.room

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

    console.log('⏺Finished execution and used', Game.cpu.getUsed().toFixed(3), 'CPU. \n')

    // console.clear();
    // console.log("<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')[0].parentNode).scope().Console.clear()</script>")

}
