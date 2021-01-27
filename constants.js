var CONSTANTS = {
    // STD_JOB_TIME: 200,
    // STD_JOB_TIME_VAR: 30,
    // ALL_JOB_TIMEOUT: 3000,
    //
    // FREQ_LOW: 50,
    // FREQ_MID: 20,
    // FREQ_HIGH: 6,

    STD_JOB_TIME: 20,
    STD_JOB_TIME_VAR: 3,
    ALL_JOB_TIMEOUT: 130,
    FREQ_LOW: 13,
    FREQ_MID: 7,
    FREQ_HIGH: 4,

    CREEPS_SPECS: {
        // ratio of the body parts desired in a new spawn
        // [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        // [50,   100,  50,    80,     150,           250,  600,   10   ]
        WORKER: [1,1,1,0, 0,0,0,0],
        DOCTOR: [2,1,1,0, 0,1,0,0] // so min energy 500
    },

}

module.exports = CONSTANTS
