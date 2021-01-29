var utility = require('utility');

var creepController = {
    run: function() {
        // utility.runForAllCreeps(creepController.executeJob)
    },

    executeJob: function(creep) {
        console.log('creepController.executeJob: creep ' + creep.name)
    },

}

module.exports = creepController
