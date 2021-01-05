var creepRoleBalance = require('creep.roleBalance');

var creepPopulationControl = {

    check: function() {
        // Spawns stuff

        let specification = creepRoleBalance.specification

        var spawn = Game.spawns['Spawn1']
        var room = spawn.room

        var totalEnergyAvailable = creepRoleBalance.countEnergy(spawn).available

        creepRoleBalance.balanceSpec(specification['harvester'], totalEnergyAvailable)

        let roles = creepRoleBalance.creepsType(room)

        var harvesters = roles.harvester // _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders   = roles.builder // _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders  = roles.upgrader // _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var doctors    = roles.doctor // _.filter(Game.creeps, (creep) => creep.memory.role == 'doctor');

        console.log('Have ' + 'harvester: ' + harvesters.length
                            + ', builders: ' + builders.length
                            + ', upgraders: ' + upgraders.length
                            + ', doctors: ' + doctors.length
                    )

        let energy = Math.max(totalEnergyAvailable, 300)

        // MARK - Minimum population control
        // TODO: fix these duplicate code and make this work better with the auto spawning in roleBalane

        if(harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            var bodyParts = creepRoleBalance.balanceSpec(specification.harvester, energy)
            var o = spawn.spawnCreep(bodyParts, newName, {memory: {role: 'harvester'}});
            console.log('Spawning new harvester: ' + newName + ', returned: ' + o);
        }

        if(builders.length < 1) {
            var newName = 'Builder' + Game.time;
            var bodyParts = creepRoleBalance.balanceSpec(specification.builder, energy)
            let o = spawn.spawnCreep(bodyParts, newName, {memory: {role: 'builder'}})
            console.log('Spawning new builder: ' + newName + ', returned: ' + o);
        }

        if (upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time
            var bodyParts = creepRoleBalance.balanceSpec(specification.upgrader, energy)
            let o = spawn.spawnCreep(bodyParts, newName, {memory: {role: 'upgrader', upgrading: false}} );
            console.log('Spawning new upgrader: ' + newName + ', returned: ' + o)
        }

        if ((doctors.length < 1) && (totalEnergyAvailable >= 500)) {
            var newName = 'Doctor' + Game.time
            let bodyParts = creepRoleBalance.balanceSpec(specification.doctor, totalEnergyAvailable)
            let o = spawn.spawnCreep(bodyParts, newName, {memory: {role: 'doctor'}})
            console.log('Spawning new doctor: ' + newName + ', returned: ' + o)
        }


        // Displays a visual on Spawn showing a creep is being
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}


module.exports = creepPopulationControl;
