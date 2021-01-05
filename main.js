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

    console.log('main: ✅ Current game time is: ' + Game.time + ' -------------------------------')

    let spawn = Game.spawns['Spawn1']
    let room = spawn.room

    creepRoleBalance.trySpawn(spawn)
    creepRoleBalance.balanceBuilderUpgrader(room)
    creepRoleBalance.balanceUpgraderHarvester(room)

    towerBasics.run(room)

    creepMemoryManagement.run()
    creepPopulationControl.check()

    // creepPopulationControl.check.balance()

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
