var creepRole = {

    Role: class {
        constructor(roleTypeID) {
            this.roleTypeID = roleTypeID
            // this.id =
            this.createdTime = Game.time
            this.priority = 0
        }
    },

    // CREEP_BODY: {
    //     WORKER: { id: "worker",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    //     HARVESTER: { id: "harvester",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    //     QUEEN: { id: "queen",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    //     SOILDER: { id: "soiler",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    //     PULLER: { id: "puller",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    //     CLAIMER: { id: "claimer",
    //         bodyFromSpawn: function(spawn) {  }
    //     },
    // },

    ROLE_TYPE: {
        // GENERAL_WORKER: { id: 100, },

        HARVESTER: { id: 120,
            bodyFromSpawn: function(spawn) { },
            transferable: function(creep) { },
        },
        HARVESTER_S: { id: 121, // Smart harvester with container and link usage
        },
        // HARVESTER_CL: { id: 122, },

        UPGRADER: { id: 130, },
        // UPGRADER_C: {}

        BUILDER: { id: 140, },
        QUEEN: { id: 160, },

        CLAIMER: { id: 200, },
        SCOUT: { id: 210,},
        PULLER: { id: 220, },

        ATTACKER: { id: 300, },
        HEALER: { id: 310, },
        SCAPEGOAT: { id: 350 },

    },
}

module.exports = creepRole
