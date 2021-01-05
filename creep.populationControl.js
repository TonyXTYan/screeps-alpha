var creepRoleBalance = require('creep.roleBalance');

var creepPopulationControl = {

    check: function() {
        // Spawns stuff
        const spawnName = 'Spawn1';


        const specification = {
            // ratio of parts desired
            // [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
            // [50,   100,  50,    80,     150,           250,  600,   10   ]
            "harvester":    [1,1,1,0, 0,0,0,0],
            "builder":      [1,1,1,0, 0,0,0,0],
            "upgrader":     [1,1,1,0, 0,0,0,0],
            "doctor":       [2,1,1,0, 0,1,0,0] // so min energy 500
        }

        var spawn = Game.spawns[spawnName]
        var room = spawn.room
        var extensionStructures = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        })
        // console.log(extensionStructures.length + ', ' + extensionStructures[0].store.getCapacity(RESOURCE_ENERGY))

        var totalEnergyCapacity = creepRoleBalance.countEnergy(spawn).capacity

        creepRoleBalance.balanceSpec(specification['harvester'], totalEnergyCapacity)


        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var doctors = _.filter(Game.creeps, (creep) => creep.memory.role == 'doctor');

        // console.log('Have ' + upgraders.length + ' Upgraders')
        console.log('Have ' + 'harvester: ' + harvesters.length
                            + ', builders: ' + builders.length
                            + ', upgraders: ' + upgraders.length
                            + ', doctors: ' + doctors.length
                    )
        // console.log('test' + test)


        if(harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            var bodyParts = creepRoleBalance.balanceSpec(specification.harvester, totalEnergyCapacity)
            // console.log(parts)
            var o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'harvester'}});
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Harvester0B', {memory: {role: 'harvester'}})

            if (o == ERR_NOT_ENOUGH_ENERGY) {
                o = Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'harvester'}});
            }

            console.log('Spawning new harvester: ' + newName + ', returned: ' + o);
        }

        if(builders.length < 1) {
            var newName = 'Builder' + Game.time;
            var bodyParts = creepRoleBalance.balanceSpec(specification.builder, totalEnergyCapacity)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'builder'}})
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Builder0B', {memory: {role: 'builder'}})
            if (o == ERR_NOT_ENOUGH_ENERGY) {
                o = Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'builder'}});
            }
            console.log('Spawning new builder: ' + newName + ', returned: ' + o);
        }

        if (upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time
            var bodyParts = creepRoleBalance.balanceSpec(specification.upgrader, totalEnergyCapacity)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'upgrader', upgrading: false}} );
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Upgrader0A', {memory: {role: 'upgrader'}})
            if (o == ERR_NOT_ENOUGH_ENERGY) {
                o = Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
            }
            console.log('Spawning new upgrader: ' + newName + ', returned: ' + o)
        }

        if ((doctors.length < 1) && (totalEnergyCapacity >= 500)) {
            var newName = 'Doctor' + Game.time
            let bodyParts = creepRoleBalance.balanceSpec(specification.doctor, totalEnergyCapacity)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'doctor'}})
            console.log('Spawning new doctor: ' + newName + ', returned: ' + o)
        }



        // Displays a visual on Spawn showing a creep is being
        if(Game.spawns[spawnName].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}


module.exports = creepPopulationControl;
