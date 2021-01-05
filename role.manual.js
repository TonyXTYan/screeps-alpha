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

        // target = [31,17]
        //
        // creep.room.find(FIND_SOURCES, {
        //     filter: (structure) => {
        //         return (structure.structureType == STRUCTURE_WALL)
        //     }
        // })
        //
        // creep.harvest()

        console.log('🦾 manual')

        // let containersTest = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return structure.structureType == STRUCTURE_CONTAINER
        //     }
        // })
        //
        // console.log(containersTest.length + ' is ' + containersTest)
        //
        // let code = creep.withdraw(containersTest[0], RESOURCE_ENERGY)
        //
        // if (code == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(containersTest[0], {visualizePathStyle: { stroke: '#ff0000'}})
        // } else  {
        //     console.log('code: ' + code)
        // }

	}
};

module.exports = roleManual;
