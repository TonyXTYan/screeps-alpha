var roleDoctor = require('role.doctor');

var towerBasics = {

    run: function(room) {

        var towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => { return structure.structureType == STRUCTURE_TOWER }
        })

        // console.log('Towers: ' + towers.length)
        // console.log('test1')

        for (let index in towers) {
            let tower = towers[index]
            // console.log(tower);
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            } else {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: roleDoctor.repairStructureFilter
                });

                var closestAbsoluteDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { return structure.hits < structure.hitsMax }
                });

                var closestUrgentDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < 500 // ||
                              // (structure.hits / structure.hitsMax < 0.001)
                    }
                })

                var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => { return creep.hits < creep.hitsMax }
                })

                // console.log('tower.basis: ' + closestDamagedStructure)

                if (closestDamagedCreep) {
                    tower.repair(closestDamagedCreep)
                    console.log('tower.basics: ' + tower + ' repair ' + closestDamagedCreep)
                } else if(closestUrgentDamagedStructure) {
                    tower.repair(closestUrgentDamagedStructure)
                    console.log('tower.basics: ' + tower + ' repair ' + closestUrgentDamagedStructure)
                } else if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                    console.log('tower.basics: ' + tower + ' repair ' + closestDamagedStructure)
                } else if(closestAbsoluteDamagedStructure) {
                    tower.repair(closestAbsoluteDamagedStructure)
                    console.log('tower.basics: ' + tower + ' repair ' + closestAbsoluteDamagedStructure)
                } else {
                    console.log('tower.basics: ' + tower + ' is idle')
                }
            }


        }
    }
}

module.exports = towerBasics
