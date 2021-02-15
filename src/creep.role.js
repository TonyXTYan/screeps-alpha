var creepRole = {

    Role: class {
        constructor(roleTypeID) {
            this.roleTypeID = roleTypeID
            // this.id =
            this.createdTime = Game.time
            this.priority = 0
        }
    },

    ROLE_TYPE: {
        // GENERAL_WORKER: { id: 100, },

        HARVESTER: { id: 120, },
        HARVESTER_C: { id: 121, },
        HARVESTER_CL: { id: 122, },

        UPGRADER: { id: 130, },
        // UPGRADER_C: {}

        BUILDER: { id: 140, },

        CLAIMER: { id: 200, },
        SCOUT: { id: 210,},
        PULLER: { id: 220, },

        ATTACKER: { id: 300, },
        HEALER: { id: 310, },

    },

    memoryCheck: function() {

    },
}

module.exports = creepRole
