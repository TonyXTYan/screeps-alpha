var CONSTANTS = require('constants')
var RETURN = CONSTANTS.RETURN
var jobUtility = require('job.utility')
var utility = require('utility')


var jobContract = {
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
            // let id = job.jobTypeId + '_' + Game.time + '_' + Memory.jobs.createdThisTick
            this.id = jobTypeId + '_' + Game.time + '_' + Memory.jobs.createdThisTick
            Memory.jobs.createdThisTick++
            if (this.id === undefined) { console.log('❗️❗️❗️❗️❗️jobContract.constructor: WTF JS? ' + id )}

            // this.id = undefined
            this.jobTypeId = jobTypeId

            this.createdTime = Game.time
            this.deadline = Game.time + CONSTANTS.STD_JOB_TIME + utility.general.getRandomInt(-CONSTANTS.STD_JOB_TIME_VAR, CONSTANTS.STD_JOB_TIME_VAR)
            // this.absoluteInvalidTime = Number.MAX_SAFE_INTEGER
            this.assignedTo = undefined
        }

    },

//  ######
//  #     # ###### ###### # #    # # ##### #  ####  #    #
//  #     # #      #      # ##   # #   #   # #    # ##   #
//  #     # #####  #####  # # #  # #   #   # #    # # #  #
//  #     # #      #      # #  # # #   #   # #    # #  # #
//  #     # #      #      # #   ## #   #   # #    # #   ##
//  ######  ###### #      # #    # #   #   #  ####  #    #

    CONTRACT: {
        // GET RESOURCES
        // harvest energy from source or minerals from deposits.
        HARVEST: { id: 100,
            callback: {
                created: function(job) {
                    let target = Game.getObjectById(job.target)
                    // if (target === undefined) { return -2 }
                    target.room.memory.sources[job.target].jobsLinked.push(job.id)
                    return OK
                },
                validate: function(job) {
                    if (job.creepId) {
                        console.log('jobContract.HARVEST.validate: ' + job.deadline)
                        job.deadline += 100
                        console.log('jobContract.HARVEST.validate: ' + job.deadline)
                    }
                    return RETURN.USE_UNIVERSAL_CALLBACK
                },
                assigned: function(job) {
                    if (job.creepId === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                    let creep = Game.getObjectById(job.creepId)
                    creep.memory.jobLinked = job.id
                    return RETURN.OK
                },
                completed: function(job) {
                    let creep = Game.getObjectById(job.creepId)
                    creep.memory.jobLinked = undefined
                    return RETURN.DELETE_THIS_JOB
                },
                removing: function(job) {
                    // console.log('here hehe')
                    let target = Game.getObjectById(job.target)
                    // console.log(target)
                    // console.log(target.room)
                    // console.log(target.room.memory)
                    if (target === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    let array = target.room.memory.sources[target.id].jobsLinked
                    let replacement = utility.general.arrayDeleteOne(array, job.id)
                    target.room.memory.sources[target.id].jobsLinked = replacement
                    // let replacement =

                    // searchJobsUtility.energyRelated.postJobForSourcesIn()

                    let creep = Game.getObjectById(job.creepId)
                    if (creep !== null) { creep.memory.jobLinked = undefined }
                    return OK
                },
            },
        },

        // // harvest and drop immediately to container
        HARVEST_PURE: { id: 101,
            callback: {
                created: function(job) {
                    let target = Game.getObjectById(job.target)
                    // if (target === undefined) { return -2 }
                    target.room.memory.sources[job.target].jobsLinked.push(job.id)
                    return OK
                },
                validate: function(job) { return RETURN.USE_UNIVERSAL_CALLBACK },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) {
                    // console.log('here hehe')
                    let target = Game.getObjectById(job.target)
                    // console.log(target)
                    // console.log(target.room)
                    // console.log(target.room.memory)
                    if (target === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    let array = target.room.memory.sources[target.id].jobsLinked
                    let replacement = utility.general.arrayDeleteOne(array, job.id)
                    target.room.memory.sources[target.id].jobsLinked = replacement
                    // let replacement =

                    // searchJobsUtility.energyRelated.postJobForSourcesIn()
                    return OK
                },
            },
        },


        WITHDRAW: { id: 104,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
        PICKUP: { id: 106,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
        DISMANTLE: { id: 108,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },

        // PUT RESOURCES
        BUILD: { id: 110,
            callback: {
                created: function(job) {
                    let site = Game.getObjectById(job.site)
                    // if (site === undefined) { return -2 }
                    site.room.memory.constructions[job.site].jobLinked = job.id
                    return OK
                },
                validate: function(job) {
                    if (job.creepId) { job.deadline += 100 }
                    return RETURN.USE_UNIVERSAL_CALLBACK
                },
                assigned: function(job) {
                    if (job.creepId === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                    let creep = Game.getObjectById(job.creepId)
                    creep.memory.jobLinked = job.id
                    return RETURN.OK
                },
                completed: function(job) {
                    let creep = Game.getObjectById(job.creepId)
                    creep.memory.jobLinked = undefined
                    return RETURN.DELETE_THIS_JOB
                },
                removing: function(job) {
                    let site = Game.getObjectById(job.site)
                    if (site === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    site.room.memory.constructions[site.id].jobLinked = undefined

                    let creep = Game.getObjectById(job.creepId)
                    if (creep !== null) { creep.memory.jobLinked = undefined }
                    return OK
                },
            },
        },
        UPGRADE_RC: { id: 112,
            callback: {
                created: function(job) {
                    let controller = Game.getObjectById(job.controller)
                    // if (controller === undefined) { return -2 }
                    controller.room.memory.controllerJobs.push(job.id)
                    return OK
                },
                validate: function(job) {
                    if (job.creepId) {
                        console.log('jobContract.UPGRADE_RC.validate: ' + job.deadline)
                        job.deadline += 100
                        console.log('jobContract.UPGRADE_RC.validate: ' + job.deadline)
                    }
                    return RETURN.USE_UNIVERSAL_CALLBACK
                },
                assigned: function(job) {
                    if (job.creepId === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                    let creep = Game.getObjectById(job.creepId)
                    creep.memory.jobLinked = job.id
                    return RETURN.OK
                },
                completed: function(job) {
                    let creep = Game.getObjectById(job.creepId)
                    // console.log('here ', creep)
                    if (creep == null) { return RETURN.DELETE_THIS_JOB } // TODO: FIXME: MEMORY AUDIT
                    creep.memory.jobLinked = undefined
                    return RETURN.DELETE_THIS_JOB // TODO: change this to renew
                },
                removing: function(job) {
                    let controller = Game.getObjectById(job.controller)
                    if (controller === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    let array = controller.room.memory.controllerJobs
                    let replacement = utility.general.arrayDeleteOne(array, job.id)
                    controller.room.memory.controllerJobs = replacement

                    let creep = Game.getObjectById(job.creepId)
                    if (creep !== null) { creep.memory.jobLinked = undefined }

                    return OK
                },
            },
        },
        TRANSFER: { id: 114,
            callback: {
                created: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    // if (structure === undefined) { return -2 }
                    structure.room.memory.structures[job.structure].jobTransferLinked = job.id
                    return OK
                },
                validate: function(job) { return RETURN.USE_UNIVERSAL_CALLBACK },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    if (structure === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    structure.room.memory.structures[structure.id].jobTransferLinked = undefined
                    return OK
                },
            }
        },
        DROP: { id: 116,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },

        // CREEP OR TOWER ish
        ATTACK: { id: 120,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },
        // ATTACK_RANGED:  { }
        ATTACK_MASS: { id: 121,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
            }
        },
        HEAL: { id: 124,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },
        REPAIR: { id: 126,
            callback: {
                created: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    // if (structure === null)
                    structure.room.memory.structures[job.structure].jobRepairLinked = job.id
                    return OK
                },
                validate: function(job) { return RETURN.USE_UNIVERSAL_CALLBACK },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    if (structure === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    structure.room.memory.structures[structure.id].jobRepairLinked = undefined
                    return OK
                },
            }
        },

        // TRANSPORT
        MOVE: { id: 130,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },
        // PULLER: {id: , parts: []}, // TODO: check this
        // PULLED: {id: , parts: []},

        // OTHER
        CLAIM:  { id: 180,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },
        RESERVE_RC: { id: 185,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            }
        },

        // SPAWN ACTION
        SPAWN: { id: 200,
            callback: {
                created: function(job) {
                    let spawn = Game.getObjectById(job.spawn)
                    // if (spawn === undefined) { return -2 }
                    spawn.memory.jobsLinked.push(job.id)
                    return OK
                },
                validate: function(job) { return RETURN.USE_UNIVERSAL_CALLBACK },
                assigned: function(job) {
                    // let jobTypeId
                    // let job = Memory.jobs.contracts[job.jobTypeId]
                    if (job.bodySpec === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                    // let bodySpec = job.bodySpec
                    let spawn = Game.getObjectById(job.spawn)
                    spawn.memory.currentJob = job.id

                    // return RETURN.ERR_I_AM_WORKING_ON_IT
                    return OK
                },
                completed: function(job) {
                    // if (job.bodySpec === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                    let spawn = Game.getObjectById(job.spawn)
                    spawn.memory.currentJob = undefined
                    // jobContract.removeJob(job)
                    return RETURN.DELETE_THIS_JOB
                },
                removing: function(job) {
                    let spawn = Game.getObjectById(job.spawn)
                    if (spawn === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                    let array = spawn.memory.jobsLinked
                    let replacement = utility.general.arrayDeleteOne(array, job.id)
                    spawn.memory.jobsLinked = replacement
                    return OK
                },
            },
        },

        RECYCLE: { id: 210,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
        RENEW: { id: 220,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },

        // ROOM CONTROLLER
        SAFE_MODE: { id: 300,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
        UNCLAIM: { id: 301,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },

        // OTHER STUFF
        LINK_TRANSFER: { id: 400,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },

        CPU_PIXEL: { id: 500,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
        CPU_UNLOCK: { id: 510,
            callback: {
                created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            },
        },
    },



//  #     #
//  ##   ## ###### ##### #    #  ####  #####   ####
//  # # # # #        #   #    # #    # #    # #
//  #  #  # #####    #   ###### #    # #    #  ####
//  #     # #        #   #    # #    # #    #      #
//  #     # #        #   #    # #    # #    # #    #
//  #     # ######   #   #    #  ####  #####   ####

    universalCallback: {
        created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
        validate: function(job) {
            if (job.deadline + 10 < Game.time && job.assignedTo === undefined) {
                // console.log('jobCallBacks.validate: ' + job.id)
                jobContract.removeJob(job)
            }
            return OK
        },
        assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
        completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
        removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
    },

    CALLBACK_TYPE: {
        CREATED: 'created',
        VALIDATE: 'validate',
        ASSIGNED: 'assigned',
        COMPLETED: 'completed',
        REMOVING: 'removing',
    },

    runCallbackForJob: function(job, callback) {
        // console.log('jobContract.runCallbackForJob: called on job ' + job.id, 'and callback:', callback)
        if (!callback) { return RETURN.ERR_PARAMETER_MISSING }
        let jobTypeId = job.jobTypeId
        for (let key in jobContract.CONTRACT) {
            let jobType = jobContract.CONTRACT[key]
            if (jobType.id == job.jobTypeId) {
                let func = jobContract.CONTRACT[key].callback[callback]
                // console.log(key, jobType.id, job.jobTypeId, typeof func == 'function')
                if (!func) {
                    console.log('‼️‼️jobContract.runCallbackForJob: for job ' + job.id + ', callback ' + callback + ', function undefined')
                    return RETURN.ERR_PARAMETER_INVALID
                }
                let code = func(job)
                if (code == RETURN.USE_UNIVERSAL_CALLBACK) {
                    return jobContract.universalCallback[callback](job)
                } else if (code == RETURN.ERR_BEHAVIOUR_UNDEF) {
                    console.log('jobContract.runCallbackForJob: ' + callback + ' on ' + job.id + ' undefined behaviour falling back using default')
                    return jobContract.universalCallback[callback](job)
                } else { return code }
            }
        }
    },


    /**
     * validationRoutine - run the validation function for this job after the deadline has passed
     */
    validationRoutine: function() {
        function validate(job) {
            // console.log('')
            if (job.deadline < Game.time) {
                // console.log('jobContract.validateRoutine: job: ' + job.id + ' outdated')

                if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
                    console.log('❗️jobContract.validateRoutine: timeout forced removed ' + job.id )
                    jobContract.removeJob(job)
                } else {
                    jobContract.validateJob(job)
                }
            }
        }

        jobUtility.mapAllJobs(validate)
    },


    validateJob: function(job) {
        let code = jobContract.runCallbackForJob(job, jobContract.CALLBACK_TYPE.VALIDATE)
        // switch (code) {
        //     case OK: return
        //     default: {
        //         console.log('❗️jobContract.validateJob: ')
        //     }
        // }
        if (code != OK) {
            console.log('❗️jobContract.validateJob: id = ' + job.id + ', code = ' + code)
        }
    },

    /**
     * removeJob - Request to remove this job
     *
     * @param  {Contract} job attempt to remove this job from memory
     * TODO: return some value
     */
    removeJob: function(job) {
        let code = jobContract.runCallbackForJob(job, jobContract.CALLBACK_TYPE.REMOVING)

        // console.log('jobContract.removeJob: called on job: ' + job.id + ', code: ' + code)
        function removeFromMemory() {
            Memory.jobs.contracts[job.jobTypeId][job.id] = undefined
        }
        if (code == OK) {
            // console.log('jobContract.removeJob: peacefully ' + job.id + ' with code: ' + code)
            // removeFromMemory()
        } else if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
            console.log('❗️jobContract.removeJob: VERY FORCED id = ' + job.id + ' btw code ' + code)
            // removeFromMemory()
        } else if (code == RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL) {
            console.log('❗️jobContract.removeJob: got invalid memory addres')
            // removeFromMemory()
            jobContract.memoryValidation.fullAudit() // break this down a bit
        } else {
            console.log('❗️jobContract.removeJob: forced id = ' + job.id + ' with code ' + code)
        }
        removeFromMemory()
    },


    /**
     * postJob - Post/Schedule a job in memory
     *
     * @param  {Contract} job Putting this job in Memory
     * @return {type}     TODO:
     */
    postJob: function(job){
        // console.log('postJob: begin')
        // let id = job.jobTypeId + '_' + Game.time + '_' + Memory.jobs.createdThisTick
        // if (id === undefined) { console.log('❗️jobContract.postJob: WTF JS? ' + id )}
        // job.id = id
        // Memory.jobs.createdThisTick++
        if(Memory.jobs === undefined) { Memory.jobs = {} }
        if(Memory.jobs.contracts === undefined) { Memory.jobs.contracts = {} }
        if(Memory.jobs.contracts[job.jobTypeId] === undefined) { Memory.jobs.contracts[job.jobTypeId] = {} }
        Memory.jobs.contracts[job.jobTypeId][job.id] = job
        // console.log('jobContract.postJob: ' + id + ', has time ' + (job.deadline - Game.time))
        let code = jobContract.runCallbackForJob(job, jobContract.CALLBACK_TYPE.CREATED)
        if (code != OK) {
            console.log('❗️jobContract.postJob: id = ' + id + ', callBack code: ' + code)
        }
    },


    /**
     * assignedJob - Call back when the job has been assigned
     */
    assignedJob: function(job) {
        let code = jobContract.runCallbackForJob(job, jobContract.CALLBACK_TYPE.ASSIGNED)
        if (code != OK) {
            console.log('jobContract.assignedJob: job ' + job.id + ' called back with code ' + code)
        }
    },


    /**
     * completedJob - Call back when this job is finished
     */
    completedJob: function(job) {
        let code = jobContract.runCallbackForJob(job, jobContract.CALLBACK_TYPE.COMPLETED)
        if (code == RETURN.DELETE_THIS_JOB) {
            jobContract.removeJob(job)
        } else if (code == RETURN.KEEP_THIS_JOB) {
            console.log('jobContract.completedJob: WHAT ARE YOU THINKING? ' + job.id)
        }
        console.log('jobContract.completedJob: called job ' + job.id + ' with code ' + code)
    },

    memoryValidation: { // TODO: This
        fullAudit: function() {
            console.log('⁉️⁉️jobContract.fullAudit: TODO THIS 📛📛💯⁉️')
        },

        auditJobTypeMemory: function(jobTypeId) {

        },

        checkSourceHarvestJobs: function() {

        },
    }
}



module.exports = jobContract
