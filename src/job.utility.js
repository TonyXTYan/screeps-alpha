var CONSTANTS = require('constants')
var utility = require('utility');

var jobUtility = {
    CONTRACTS: {
        // GET RESOURCES
        // harvest energy from source or minerals from deposits.
        HARVEST:        100, //{ id: 100, parts: [WORK] },
        // // harvest and drop immediately to container
        HARVEST_PURE:   101, //{ id: 101, parts: [WORK] },
        WITHDRAW:       104, //{ id: 104, parts: [] },
        PICKUP:         106, //{ id: 106, parts: [CARRY] }, //
        DISMANTLE:      108, //{ id: 108, parts: [WORK] }, //

        // PUT RESOURCES
        BUILD:          110, //{ id: 110, parts: [WORK, CARRY] },
        UPGRADE_RC:     112, //{ id: 112, parts: [WORK, CARRY] },
        TRANSFER:       114, //{ id: 114, parts: [CARRY] },
        DROP:           116, //{ id: 116, parts: [CARRY] }, // Drop on top of ground or container

        // CREEP OR TOWER ish
        ATTACK:         120, //{ id: 120, parts: [ATTACK] },
        // ATTACK_RANGED:  { }
        ATTACK_MASS:    121, //{ id: 121, parts: [RANGED_ATTACK] },
        HEAL:           124, //{ id: 124, parts: [HEAL] }, // heal creeps
        REPAIR:         126, //{ id: 126, parts: [WORK, CARRY] }, // repair structure

        // TRANSPORT
        MOVE:           130, //{ id: 130, parts: [MOVE] },
        // PULLER: {id: , parts: []}, // TODO: check this
        // PULLED: {id: , parts: []},

        // OTHER
        CLAIM:          180, //{ id: 180, parts: [CLAIM] },
        RESERVE_RC:     184, //{ id: 184, parts: [CLAIM] },

        // SPAWN ACTION
        SPAWN:          200, //{ id: 200 },
        RECYCLE:        210, //{ id: 210 },
        RENEW:          220, //{ id: 220 },

        // ROOM CONTROLLER
        SAFE_MODE:      300, //{ id: 300 },
        UNCLAIM:        301, //{ id: 301 },

        // OTHER STUFF
        LINK_TRANSFER:  400, //{ id: 400 },

        CPU_PIXEL:      500, //{ id: 500 },
        CPU_UNLOCK:     510, //{ id: 510 }

    },

    /**
     * mapJobsType - Mapping function across all this job type
     *
     * @param {number} type type of job as defined above in CONTRACTS
     * @param {function} func function to be mapped
     */
    mapJobsType: function(type, func) {
        for (let id in Memory.jobs.contracts[type]){
            if (Memory.jobs.contracts[type][id] === undefined) { console.log('❗️jobUtility.mapJobsType: async problem on ' + id); continue }
            func(Memory.jobs.contracts[type][id])
        }
    },


    /**
     * mapAllJobs - Map this function across all jobs
     *
     * @param  {function} func function to be mapped
     */
    mapAllJobs: function(func) {
        for(let type in Memory.jobs.contracts) {
            jobUtility.mapJobsType(type, func)
        }
    },


    /**
     * jobCount - Count the number of jobs cached in Memory
     *
     * @return {number}  the number of jobs
     */
    jobCount: function() {
        var output = new Object()
        if (Memory.jobs === undefined) { return output }
        output.all = 0
        for(let type in Memory.jobs.contracts) {
            output[type] = Object.keys(Memory.jobs.contracts[type]).length
            output.all += output[type]
        }
        return output
    },


    /**
     * getJobFromId - Get the job Object for given job ID.
     *
     * @param  {string} id The ID of this job
     * @return {Object}    The Contract Object
     */
    getJobFromId: function(id) {
        let typeId = id.split('_')[0]
        // console.log(typeId)
        // let job = Memory.jobs.contracts[typeId][id]
        // console.log(job)
        return Memory.jobs.contracts[typeId][id]
    },


    /**
     * The Contract to be store in Memory.jobs.contracts[jobTypeId][jobId]    
     */
    Contract: class {

        /**
         * constructor - description
         *
         * @param  {number} deadline of game tick time that the task need to finish before
         * @return {Contract}      description
         */

        //
        constructor(jobTypeId) {
            /**
             * test documentation
             * @type {number}
             */
            this.id = undefined
            this.jobTypeId = jobTypeId

            this.createdTime = Game.time
            this.deadline = Game.time + CONSTANTS.STD_JOB_TIME + utility.general.getRandomInt(-CONSTANTS.STD_JOB_TIME_VAR, CONSTANTS.STD_JOB_TIME_VAR)
            // this.absoluteInvalidTime = Number.MAX_SAFE_INTEGER
            this.assignedTo = undefined
        }

    }
}

module.exports = jobUtility
