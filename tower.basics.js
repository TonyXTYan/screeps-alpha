var towerBasics = {

    run: function(room) {

        var towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => { return structure.structureType == STRUCTURE_TOWER }
        })

        console.log('Towers: ' + towers.length)
        // console.log('test1')

        for (let index in towers) {
            let tower = towers[index]
            // console.log(tower);
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });

            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}

module.exports = towerBasics
