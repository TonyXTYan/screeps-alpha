var CONSTANTS = {
    // STD_JOB_TIME: 200,
    // STD_JOB_TIME_VAR: 30,
    // ALL_JOB_TIMEOUT: 3000,
    //
    // FREQ_LOW: 50,
    // FREQ_MID: 20,
    // FREQ_HIGH: 6,

    STD_JOB_TIME: 20,
    STD_JOB_TIME_VAR: 10,
    ALL_JOB_TIMEOUT: 130,
    FREQ_LOW: 10,
    FREQ_MID: 7,
    FREQ_HIGH: 4,
    //
    //

    STARTER_LEVEL: 5,
    STARTER_HITS_MAX: 1000000,

    CREEPS_SPECS: {
        // ratio of the body parts desired in a new spawn
        // [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        // [50,   100,  50,    80,     150,           250,  600,   10   ]
        WORKER: [1,1,1,0, 0,0,0,0],
        DOCTOR: [2,1,1,0, 0,1,0,0] // so min energy 500
    },

    RETURN: {
        OK: 0, // duplicate definition
        // INSTRUCTIONS
        DELETE_THIS_JOB: 100,
        KEEP_THIS_JOB: 110,
        USE_DEFAULT_TRIVIAL_IMPLEMENTATION: 200,
        USE_DEFAULT_ALTERNATIVE: 201,
        USE_DEFAULT_COMPLICATED: 202,

        // ERRORS
        ERR_MEMORY_ADDRESS_RETURNS_NULL: -100,
        ERR_MEMORY_REQUIRED_UNDEF: -110,
        ERR_BEHAVIOUR_UNDEF: -200,
        ERR_I_AM_WORKING_ON_IT: -201,
    }

}

module.exports = CONSTANTS
