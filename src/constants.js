var CONSTANTS = {
    // STD_JOB_TIME: 200,
    // STD_JOB_TIME_VAR: 30,
    // ALL_JOB_TIMEOUT: 3000,
    //
    // FREQ_LOW: 50,
    // FREQ_MID: 20,
    // FREQ_HIGH: 6,

    STD_JOB_TIME: 30,
    STD_JOB_TIME_VAR: 10,
    ALL_JOB_TIMEOUT: 200,
    FREQ_LOW: 10,
    FREQ_MID: 7,
    FREQ_HIGH: 4,



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
        USE_UNIVERSAL_CALLBACK: 1000,

        // ERRORS
        ERR_PARAMETER_MISSING: -100,
        ERR_PARAMETER_INVALID: -110,
        ERR_MEMORY_ADDRESS_RETURNS_NULL: -1000,
        ERR_MEMORY_REQUIRED_UNDEF: -1010,
        ERR_BEHAVIOUR_UNDEF: -2000,
        ERR_I_AM_WORKING_ON_IT: -2100,
    },


    BANNER: { // https://www.patorjk.com/software/taag/#p=display&f=Banner&t=%0A
        CODE_UPDATED:
`  #####                          #     #
 #     #  ####  #####  ######    #     # #####  #####    ##   ##### ###### #####
 #       #    # #    # #         #     # #    # #    #  #  #    #   #      #    #
 #       #    # #    # #####     #     # #    # #    # #    #   #   #####  #    #
 #       #    # #    # #         #     # #####  #    # ######   #   #      #    #
 #     # #    # #    # #         #     # #      #    # #    #   #   #      #    #
  #####   ####  #####  ######     #####  #      #####  #    #   #   ###### #####  `,


    },

}

module.exports = CONSTANTS
