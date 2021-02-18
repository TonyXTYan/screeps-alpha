const CONSTANT = {

    // FREQ_VERY_LOW: 1000
    // FREQ_LOW: 200,
    // FREQ_MID: 100,
    // FREQ_HIGH: 50,
    // FREQ_VERY_HIGH: 10,


    FREQ_VERY_LOW: 100,
    FREQ_LOW: 20,
    FREQ_MID: 10,
    FREQ_HIGH: 5,
    FREQ_VERY_HIGH: 1,


    // STARTER_LEVEL: 5,
    // STARTER_HITS_MAX: 1000000,

    HITS_MAX_LIMIT: function(rcl) {
        switch (rcl) {
            case 1:  return 1e3
            case 2:  return 10e3
            case 3:  return 50e3
            case 4:  return 100e3
            case 5:  return 500e3
            case 6:  return 1e6
            case 7:  return 10e6
            case 8:  return 100e6
            default: return 100e6
        }
    },


    // CREEPS_SPECS: {
    //     // ratio of the body parts desired in a new spawn
    //     // [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
    //     // [50,   100,  50,    80,     150,           250,  600,   10   ]
    //     WORKER: [1,1,1,0, 0,0,0,0],
    //     DOCTOR: [2,1,1,0, 0,1,0,0] // so min energy 500
    // },

    RETURN: {
        OK: 0, // duplicate definition
        // INSTRUCTIONS
        // DELETE_THIS_JOB: 100,
        // KEEP_THIS_JOB: 110,
        // USE_DEFAULT_TRIVIAL_IMPLEMENTATION: 200,
        // USE_DEFAULT_ALTERNATIVE: 201,
        // USE_DEFAULT_COMPLICATED: 202,
        // USE_UNIVERSAL_CALLBACK: 1000,
        //
        EXTEND_VALID_TIME: 2000,

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
        NEW: "new"
    },

    // e.g. flag name could be CD_N_Hello
    FLAG_PREFIX: {
        CD: {
            N: "CD_N",
        },
        B: "B", // basecamp
    },



    // SITE_KIND: {
    //     RESOURCE_ENERGY: "source",
    //     RESOURCE_MINERAL: "mineral",
    //     // RESOURCE_R_RC: "source-rc", // room controller right next to a source
    //     // RESOURCE_M_RC: "mineral-rc",
    //
    //     STORAGE: "storage",
    //     UPGRADE_RC: "upgrade",
    //     BASECAMP: "basecamp",
    // }



}

module.exports = CONSTANT
