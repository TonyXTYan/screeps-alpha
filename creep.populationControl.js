var creepPopulationControl = {

    check: function() {
        // Spawns stuff
        const spawnName = 'Spawn1';

        const bodyPartName = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        const bodyPartCost = [50,   100,  50,    80,     150,           250,  600,   10   ]
        const specification = {
            // ratio of parts desired
            "harvester":    [1,1,1,0,0,0,0,0],
            "builder":      [1,1,1,0,0,0,0,0],
            "upgrader":     [1,1,1,0,0,0,0,0]
        }

        var room = Game.spawns[spawnName].room
        var extensionStructures = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        })
        // console.log(extensionStructures.length + ', ' + extensionStructures[0].store.getCapacity(RESOURCE_ENERGY))

        var totalEnergyAvailable = 300
        for (var i in extensionStructures) {
            // console.log(extension)
            totalEnergyAvailable += extensionStructures[i].store.getCapacity(RESOURCE_ENERGY)
        }
        // console.log(totalEnergyAvailable)

        // console.log(Object.keys(specification)[0])


        function balance(spec, energy) {
            // var sum = spec.reduce((a, b) => a + b, 0)
            var weighted = []
            var weightedSum = 0
            for (i in spec){
                // console.log(i)
                var c = spec[i] * bodyPartCost[i]
                weighted[i] = c
                weightedSum += c
            }
            var scale = energy / weightedSum

            // var parts = weighted.map((c) => c * scale)

            var parts = []
            for (i in spec) {
                var count = Math.floor(weighted[i] * scale / bodyPartCost[i])
                // console.log(count + ' and ' + Array(count).fill(0))
                for (c in Array(count).fill(0)) {
                    // console.log(c)
                    parts.push(bodyPartName[i])
                }
            }

            // console.log(weighted + ' and ' + scale + ' also ' +  parts)
            // counts = spec.map((c) => Math.floor(c / sum))
            return parts
        }

        balance(specification['harvester'], totalEnergyAvailable)


        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        // console.log('Have ' + harvesters.length + ' Harvesters');

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        // console.log('Have ' + builders.length + ' Builders')

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        // console.log('Have ' + upgraders.length + ' Upgraders')
        console.log('Have ' + 'harvester: ' + harvesters.length
                            + ' builders: ' + builders.length
                            + ' upgraders: ' + upgraders.length)
        // console.log('test' + test)


        if(harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            var bodyParts = balance(specification.harvester, totalEnergyAvailable)
            // console.log(parts)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'harvester'}});
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Harvester0B', {memory: {role: 'harvester'}})
            console.log('Spawning new harvester: ' + newName + ', returned: ' + o);
        }

        if(builders.length < 1) {
            var newName = 'Builder' + Game.time;
            var bodyParts = balance(specification.builder, totalEnergyAvailable)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'builder'}})
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Builder0B', {memory: {role: 'builder'}})
            console.log('Spawning new builder: ' + newName + ', returned: ' + o);
        }

        if (upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time
            var bodyParts = balance(specification.upgrader, totalEnergyAvailable)
            let o = Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: 'upgrader', upgrading: false}} );
            // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Upgrader0A', {memory: {role: 'upgrader'}})
            console.log('Spawning new upgrader: ' + newName + ', returned: ' + o)
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
