var creepMemoryManagement = {


    /**
     * run - Manages the memeory usage
     *
     * @return {type}  description
     */
    run: function() {

        // Clear the memory of non-existing creeps
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name]; // Free the memory of dead creeps
                console.log('creep.MemoryManagement: Clearing non-existing creep memory:', name);
            }
        }

        // For random
        var dictKey = {
            0: 'builder',
            1: 'harvester',
            2: 'upgrader'
            // 3: 'doctor'
        }

        // For alive creeps who doesn't have a role, gonna randomly assign them one
        // TODO: implement doctor and other stuff
        for(var name in Game.creeps) {
            var creep = Game.creeps[name]
            // console.log(name)
            if (creep.memory.role === undefined && !creep.spawning) {
                let num = Math.floor(Math.random() * 3)
                // console.log(num)
                let role = dictKey[num]
                creep.memory.role = role
                console.log('creep.MemoryManagement: ' + name + ' have been assigned ' + role)
            }
        }


        // Checking the source properties // TODO
        for (var name in Memory.rooms){
            var room = Game.rooms[name]
            for (var source in room.memory.sources) {
                var spec = room.memory.sources[source]
                // console.log(spec[0])

                var counter = 0
                for(var name in Game.creeps) {
                    var c = Game.creeps[name];
                    if (c.memory.harvestTargetSourceId == source) {
                        counter ++
                    }
                }
                room.memory.sources[source] = [spec[0], counter, spec[2]]
                // console.log(source + ' old ' + spec + ' new ' + room.memory.sources[source]) // TODO
            }
        }
    }
}

module.exports = creepMemoryManagement;
