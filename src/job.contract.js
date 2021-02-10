var CONSTANTS = require('constants')
var RETURN = CONSTANTS.RETURN


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
            this.id = undefined
            this.jobTypeId = jobTypeId

            this.createdTime = Game.time
            this.deadline = Game.time + CONSTANTS.STD_JOB_TIME + utility.general.getRandomInt(-CONSTANTS.STD_JOB_TIME_VAR, CONSTANTS.STD_JOB_TIME_VAR)
            // this.absoluteInvalidTime = Number.MAX_SAFE_INTEGER
            this.assignedTo = undefined
        }

    },

    CONTRACT: {
        // GET RESOURCES
        // harvest energy from source or minerals from deposits.
        HARVEST: {
            id: 100,
            callback: {
                created: function(job) {
                    let target = Game.getObjectById(job.target)
                    // if (target === undefined) { return -2 }
                    target.room.memory.sources[job.target].jobsLinked.push(job.id)
                    return OK
                },
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
                created: function(job) {
                    let target = Game.getObjectById(job.target)
                    // if (target === undefined) { return -2 }
                    target.room.memory.sources[job.target].jobsLinked.push(job.id)
                    return OK
                },
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
                created: function(job) {
                    let site = Game.getObjectById(job.site)
                    // if (site === undefined) { return -2 }
                    site.room.memory.constructions[job.site].jobLinked = job.id
                    return OK
                },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
            }
        },
        UPGRADE_RC: {
            id: 112,
            callback: {
                created: function(job) {
                    let controller = Game.getObjectById(job.controller)
                    // if (controller === undefined) { return -2 }
                    controller.room.memory.controllerJobs.push(job.id)
                    return OK
                },
                validate: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
                removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF }
            }
        },
        TRANSFER: {
            id: 114,
            callback: {
                created: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    // if (structure === undefined) { return -2 }
                    structure.room.memory.structures[job.structure].jobTransferLinked = job.id
                    return OK
                },
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
                created: function(job) {
                    let structure = Game.getObjectById(job.structure)
                    // if (structure === null)
                    structure.room.memory.structures[job.structure].jobRepairLinked = job.id
                    return OK
                },
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
                created: function(job) {
                    let spawn = Game.getObjectById(job.spawn)
                    // if (spawn === undefined) { return -2 }
                    spawn.memory.jobsLinked.push(job.id)
                    return OK
                },
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

        universalCallback: {
            created: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            validate: function(job) {
                if (job.deadline + 10 < Game.time && job.assignedTo === undefined) {
                    // console.log('jobCallBacks.validate: ' + job.id)
                    jobScheduler.removeJob(job)
                }
                return OK
            },
            assigned: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            completed: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
            removing: function(job) { return RETURN.ERR_BEHAVIOUR_UNDEF },
        },

    },

    /**
     * validationRoutine - run the validation function for this job after the deadline has passed
     */
    validationRoutine: function() {
        function validate(job) {
            // console.log('')
            if (job.deadline < Game.time) {
                // console.log('job: ' + id + ' outdated')
                if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
                    console.log('❗️jobScheduler.validateRoutine: timeout forced removed ' + job.id )
                    jobScheduler.removeJob(job)
                } else {
                    jobCallBack.validate(job)
                }
            }
        }
        jobUtility.mapAllJobs(validate)
    },

    runCallbackForJob: function(job, name) {
        console.log('jobContract.runCallbackForJob: called on job ' + job.id, 'and callback:', name)
        if (!name) { return RETURN.ERR_PARAMETER_MISSING }
        let jobTypeId = job.jobTypeId
        for (let key in jobContract.CONTRACT) {
            // console.log(key)
            let jobType = jobContract.CONTRACT[key]
            if (jobType.id == job.jobTypeId) {
                console.log(key, jobType.id, job.jobTypeId)
                let func = jobContract.CONTRACT[key].callback[name]
                if (!func) { return RETURN.ERR_PARAMETER_INVALID }
                return func()
            }
        }
    },

    validateJob: function(job) {

    },

    /**
     * removeJob - Request to remove this job
     *
     * @param  {Contract} job attempt to remove this job from memory
     * TODO: return some value
     */
    removeJob: function(job) {
        let code = jobCallBack.removing(job)
        // console.log('jobScheduler.removeJob: called on job: ' + job.id + ', code: ' + code)
        function removeFromMemory() {
            Memory.jobs.contracts[job.jobTypeId][job.id] = undefined
        }
        if (code == OK) {
            // console.log('jobScheduler.removeJob: peacefully ' + job.id + ' with code: ' + code)
            // removeFromMemory()
        } else if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
            console.log('❗️jobScheduler.removeJob: VERY FORCED id = ' + job.id + ' btw code ' + code)
            // removeFromMemory()
        } else if (code == RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL) {
            console.log('❕jobScheduler.removeJob: got invalid memory addres')
            // removeFromMemory()
            memoryValidation.fullAudit() // break this down a bit
        } else {
            console.log('❗️jobScheduler.removeJob: forced id = ' + job.id + ' with code ' + code)
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
        let id = job.jobTypeId + '_' + Game.time + '_' + Memory.jobs.createdThisTick
        if (id === undefined) { console.log('❗️jobScheduler.postJob: WTF JS? ' + id )}
        job.id = id
        if(Memory.jobs === undefined) { Memory.jobs = {} }
        if(Memory.jobs.contracts === undefined) { Memory.jobs.contracts = {} }
        if(Memory.jobs.contracts[job.jobTypeId] === undefined) { Memory.jobs.contracts[job.jobTypeId] = {} }
        Memory.jobs.contracts[job.jobTypeId][job.id] = job
        Memory.jobs.createdThisTick++
        // console.log('jobScheduler.postJob: ' + id + ', has time ' + (job.deadline - Game.time))
        let code = jobCallBack.created(job)
        if (code != OK) {
            console.log('❗️jobScheduler.postJob: id = ' + id + ', callBack code: ' + code)
        }
    },


    /**
     * assignedJob - Call back when the job has been assigned
     */
    assignedJob: function(job) {
        let code = jobCallBack.assigned(job)
        console.log('jobScheduler.assignedJob: called back with code ' + code)
    },


    /**
     * completedJob - Call back when this job is finished
     */
    completedJob: function(job) {
        let code = jobCallBack.completed(job)
        if (code == RETURN.DELETE_THIS_JOB) {
            jobScheduler.removeJob(job)
        } else if (code == RETURN.KEEP_THIS_JOB) {
            console.log('jobScheduler.completedJob: WHAT ARE YOU THINKING? ' + job.id)
        }
        console.log('jobScheduler.completedJob: called job' + job.id + ' with code ' + code)
    },

    memoryValidation: { // TODO: This
        fullAudit: function() {
            console.log('⁉️⁉️jobScheduler.fullAudit: TODO THIS 📛📛💯⁉️')
        },

        auditJobTypeMemory: function(jobTypeId) {

        },

        checkSourceHarvestJobs: function() {

        },
    }
}



module.exports = jobContract
