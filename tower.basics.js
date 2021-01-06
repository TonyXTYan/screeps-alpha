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

                // console.log('tower.basis: ' + closestDamagedStructure)

                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }


        }
    }
}

module.exports = towerBasics
