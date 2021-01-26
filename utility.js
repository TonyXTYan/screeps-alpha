var utility = {

    resetMemory: function() {
        console.log('💣 Reset Memeory Called!')

        // let default = {"creeps":{},"spawns":{},"rooms":{},"flags":{}}
        RawMemory.set("{'creeps':{},'spawns':{},'rooms':{},'flags':{}}");
        Memory = JSON.parse(RawMemory.get());
        // RawMemory.

        // Memory.creeps = {}

        // RawMemory.set("{}");
        //
        // Memory.creeps = {};
        // Memory.spawns = {};
        // Memory.rooms = {};
        // Memory.flags = {};
    },

    setupEnvironment: function() {


    }
}

module.exports = utility;
