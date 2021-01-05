var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var creepRoleBalance = require('creep.roleBalance');
var creepPopulationControl = require('creep.populationControl');
var creepMemoryManagement = require('creep.memoryManagement');

module.exports.loop = function () {

    // var tower = Game.getObjectById('38989286b464d5727d8995d3'); // FIXME ?
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    //
    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }


    console.log('✅ Current game time is: ' + Game.time + ' -------------------------------')

    // console.log('test sync 2')

    let spawn = Game.spawns['Spawn1']

    creepRoleBalance.trySpawn(spawn)

    creepRoleBalance.balanceBuilderUpgrader(spawn.room)

    creepMemoryManagement.run()

    creepPopulationControl.check()

    // creepPopulationControl.check.balance()


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }

}
