var roleManual = {

    run: function(creep) {
        // Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], 'Builder0B', {memory: {role: 'manual'}})

        // if(creep.store.getFreeCapacity() > 0) {
        //     var ruins = creep.room.find(FIND_STRUCTURES, {
        //         filter: (structure) => {
        //             return (structure.structureType == Ruin())
        //         }
        //     });
        // }

        target = [31,17]

        creep.room.find(FIND_SOURCES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL)
            }
        })

        creep.harvest()



	}
};

module.exports = roleManual;
