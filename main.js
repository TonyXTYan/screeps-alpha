var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDoctor = require('role.doctor');

var creepRoleBalance = require('creep.roleBalance');
var creepPopulationControl = require('creep.populationControl');
var creepMemoryManagement = require('creep.memoryManagement');

var towerBasics = require('tower.basics');

module.exports.loop = function () {

    console.log('✅ Current game time is: ' + Game.time + ' -------------------------------')

    // console.log('test sync 2')

    let spawn = Game.spawns['Spawn1']

    creepRoleBalance.trySpawn(spawn)

    creepRoleBalance.balanceBuilderUpgrader(spawn.room)

    towerBasics.run(spawn.room)

    creepMemoryManagement.run()

    creepPopulationControl.check()

    // creepPopulationControl.check.balance()


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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
    }

}
