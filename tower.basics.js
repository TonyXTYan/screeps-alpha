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

                var closestVeryUrgentDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { return (structure.hits < 500) && (structure.hitsMax > 500)}
                })

                var closestUrgentDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.hits < 10 * 1000) && structure.hitsMax > 10 * 1000) // ||
                              // (structure.hits / structure.hitsMax < 0.001)
                    }
                })

                var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => { return creep.hits < creep.hitsMax }
                })

                // console.log('tower.basis: ' + closestDamagedStructure)

                if (closestDamagedCreep) {
                    let repairCode = tower.repair(closestDamagedCreep)
                    // console.log('tower.basics: ' + tower + ' repair creep ' + closestDamagedCreep + ' returned: ' + repairCode)
                } else if(closestVeryUrgentDamagedStructure){
                    let repairCode = tower.repair(closestVeryUrgentDamagedStructure)
                } else if(closestUrgentDamagedStructure) {
                    let repairCode = tower.repair(closestUrgentDamagedStructure)
                    // console.log('tower.basics: ' + tower + ' repair urgent ' + closestUrgentDamagedStructure + ' returned: ' + repairCode)
                } else if(closestDamagedStructure) {
                    let repairCode = tower.repair(closestDamagedStructure);
                    // console.log('tower.basics: ' + tower + ' repair just ' + closestDamagedStructure + ' returned: ' + repairCode)
                } else if(closestAbsoluteDamagedStructure) {
                    let repairCode = tower.repair(closestAbsoluteDamagedStructure)
                    // console.log('tower.basics: ' + tower + ' repair abs ' + closestAbsoluteDamagedStructure + ' returned: ' + repairCode)
                } else {
                    console.log('tower.basics: ' + tower + ' is idle')
                }
            }


        }
    }
}

module.exports = towerBasics
