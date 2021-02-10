var CONSTANTS = require('constants')
var RETURN = CONSTANTS.RETURN

var CONTRACT = {
    // GET RESOURCES
    // harvest energy from source or minerals from deposits.
    HARVEST: {
        id: 100,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    // // harvest and drop immediately to container
    HARVEST_PURE: {
        id: 101,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    WITHDRAW: {
        id: 104,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    PICKUP: {
        id: 106,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    DISMANTLE: {
        id: 108,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // PUT RESOURCES
    BUILD: {
        id: 110,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    UPGRADE_RC: {
        id: 112,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    TRANSFER: {
        id: 114,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    DROP: {
        id: 116,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // CREEP OR TOWER ish
    ATTACK: {
        id: 120,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    // ATTACK_RANGED:  { }
    ATTACK_MASS: {
        id: 121,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    HEAL: {
        id: 124,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    REPAIR: {
        id: 126,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // TRANSPORT
    MOVE: {
        id: 130,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    // PULLER: {id: , parts: []}, // TODO: check this
    // PULLED: {id: , parts: []},

    // OTHER
    CLAIM:  {
        id: 180,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    RESERVE_RC: {
        id: 185,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // SPAWN ACTION
    SPAWN: {
        id: 200,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    RECYCLE: {
        id: 210,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    RENEW: {
        id: 220,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // ROOM CONTROLLER
    SAFE_MODE: {
        id: 300,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    UNCLAIM: {
        id: 301,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    // OTHER STUFF
    LINK_TRANSFER: {
        id: 400,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },

    CPU_PIXEL: {
        id: 500,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
    CPU_UNLOCK: {
        id: 510,
        callback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
        }
    },
}

module.exports = CONTRACT
