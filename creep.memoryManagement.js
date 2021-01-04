var creepMemoryManagement = {


    run: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name]; // Free the memory of dead creeps
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
}

module.exports = creepMemoryManagement;
