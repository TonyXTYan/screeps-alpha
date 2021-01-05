var creepMemoryManagement = {


    run: function() {

        for(var name in Memory.creeps) {
            // console.log(name)
            if(!Game.creeps[name]) {
                delete Memory.creeps[name]; // Free the memory of dead creeps
                console.log('Clearing non-existing creep memory:', name);
            }
        }


        var dictKey = {
            0: 'builder',
            1: 'harvester',
            2: 'upgrader'
        }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name]
            // console.log(name)
            if (creep.memory.role === undefined) {
                let num = Math.floor(Math.random() * 3)
                // console.log(num)
                let role = dictKey[num]
                creep.memory.role = role
                console.log(name + ' have been assigned ' + role)
            }
        }



        for (var name in Memory.rooms){
            // console.log(name)
            var room = Game.rooms[name]
            // console.log(room.name)
            // if (room.memory.sources !== undefined) {
                // console.log(room.memory.sources)
            // }
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
                console.log(source + ' old ' + spec + ' new ' + room.memory.sources[source]) // TODO
            }


        }

        // var roomSourceSpec = {}



    }
}

module.exports = creepMemoryManagement;
