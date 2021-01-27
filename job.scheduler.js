var utility = require('utility');
var CONSTANTS = require('constants')

var jobScheduler = {

    run: function() {
        let currentTick = Game.time
        // console.log(' ')
        console.log('contractScheduler: called')

        // console.log(JOBS.BUILD === JOBS.BUILD)
        // console.log(JOBS.BUILD === JOBS.ATTACK)

        if (Game.time % CONSTANTS.FREQ_MID == 0) { // FIXME: here
            searchJobsUtility.runAll()
        }

        jobScheduler.validateRoutine()
    },
    // do storage and arrage the contracts

    validateRoutine: function() {
        for (let id in Memory.jobs) {
            let job = Memory.jobs[id]
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
    },


    searchJobs: searchJobsUtility,

    removeJob: function(job) {
        let code = jobCallBack.removing(job)
        if (code == 0) {
            // console.log('jobScheduler.removeJob: peacefully ' + job.id + ' with code: ' + code)
            Memory.jobs[job.id] = undefined
        } else if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
            console.log('❗️jobScheduler.removeJob: VERY FORCED id = ' + job.id + ' btw code ' + code)
            Memory.jobs[job.id] = undefined
        } else {
            console.log('❗️jobScheduler.removeJob: forced id = ' + job.id + ' with code ' + code)
            Memory.jobs[job.id] = undefined
        }
    },

    postJob: function(job){
        let id = Game.time + '_' + job.jobTypeId + '_' + Memory.jobsCreatedThisTick
        Memory.jobsCreatedThisTick++
        job.id = id
        Memory.jobs[id] = job
        let code = jobCallBack.created(job)
        if (code != 0) {
            console.log('❗️jobScheduler.postJob: id = ' + id + ', callBack code: ' + code)
        }
    },


    memoryValidation: memoryValidation
}

module.exports = jobScheduler

let JOBS = {
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
    RENEW:          200, //{ id: 220 },

    // ROOM CONTROLLER
    SAFE_MODE:      300, //{ id: 300 },
    UNCLAIM:        301, //{ id: 301 },

    // OTHER STUFF
    LINK_TRANSFER:  400, //{ id: 400 },

    CPU_PIXEL:      500, //{ id: 500 },
    CPU_UNLOCK:     510, //{ id: 510 }

}


var memoryValidation = {
    checkSourceHarvestJobs: function() {

    }
}

var jobCallBack = {
    created: function(job) {
        switch(job.jobTypeId) {
            case (JOBS.HARVEST):
            case (JOBS.HARVEST_PURE): {
                let target = Game.getObjectById(job.target)
                target.room.memory.sources[job.target].jobsLinked.push(job.id)
                return 0
            };
            case (JOBS.TRANSFER): {
                let structure = Game.getObjectById(job.structure)
                structure.room.memory.structures[job.structure].jobLinked = job.id
                return 0
            }
            case (JOBS.BUILD): {
                let site = Game.getObjectById(job.site)
                site.room.memory.constructions[job.site].jobLinked = job.id
                return 0
            }
            case (JOBS.UPGRADE_RC): {
                let controller = Game.getObjectById(job.controller)
                controller.room.memory.controllerJobs.push(job.id)
                return 0
            };
            case (JOBS.SPAWN): {
                let spawn = Game.getObjectById(job.spawn)
                spawn.memory.jobsLinked.push(job.id)
                return 0
            }
            default: return -1
        }
    },

    validate: function(job) {
        // console.log('jobCallBacks.validateCallBack: called on job id ' + job.id)
        // console.log(JOBS.HARVEST.id == job.)
        switch(job.jobTypeId) {
            case (JOBS.HARVEST):
            case (JOBS.HARVEST_PURE):
            case (JOBS.TRANSFER):
            case (JOBS.BUILD):
            case (JOBS.UPGRADE_RC):
            case (JOBS.SPAWN):
            {
                if (job.deadline + 10 < Game.time && job.assignedTo === undefined) {
                    // console.log('jobCallBacks.validate: ' + job.id)
                    jobScheduler.removeJob(job)
                }
                return 0
            };
            default: return -1

        }
    },

    assigned: function(job) {

    },
    completed: function(job) {

    },

    removing: function(job) {
        // don't touch Memory.jobs, that's done after this function
        // console.log('jobCallBack.removed: on ' + job.id )
        switch(job.jobTypeId){
            case (JOBS.HARVEST):
            case (JOBS.HARVEST_PURE): {
                // console.log('here hehe')
                let target = Game.getObjectById(job.target)
                // console.log(target)
                // console.log(target.room)
                // console.log(target.room.memory)
                let array = target.room.memory.sources[target.id].jobsLinked
                let replacement = utility.general.arrayDeleteOne(array, job.id)
                target.room.memory.sources[target.id].jobsLinked = replacement
                // let replacement =

                // searchJobsUtility.energyRelated.postJobForSourcesIn()
                return 0
            };
            case (JOBS.TRANSFER): {
                let structure = Game.getObjectById(job.structure)
                structure.room.memory.structures[structure.id].jobLinked = undefined
                return 0
            };
            case (JOBS.BUILD): {
                let site = Game.getObjectById(job.site)
                site.room.memory.constructions[site.id].jobLinked = undefined
                return 0
            };
            case (JOBS.UPGRADE_RC): {
                let controller = Game.getObjectById(job.controller)
                let array = controller.room.memory.controllerJobs
                let replacement = utility.general.arrayDeleteOne(array, job.id)
                controller.room.memory.controllerJobs = replacement
                return 0
            };
            case (JOBS.SPAWN): {
                let spawn = Game.getObjectById(job.spawn)
                let array = spawn.memory.jobsLinked
                let replacement = utility.general.arrayDeleteOne(array, job.id)
                spawn.memory.jobsLinked = replacement
                return 0
            }
            default: return -1
        }
    }
}

var searchJobsUtility = {
    runAll: function() {
        utility.runForAllRooms(searchJobsUtility.energyRelated.run)
        searchJobsUtility.spawnsRelated.run()
    },

    energyRelated:  {
        run: function(room) {
            // get: harvest, withdraw
            // put: build, upgrade, transfers
            console.log('jobScheduler.searchJobsUtility.energyRelated: called 🌕')
            searchJobsUtility.energyRelated.postJobForSourcesIn(room)
            searchJobsUtility.energyRelated.postJobForStructuresIn(room)
            searchJobsUtility.energyRelated.postJobForConstructionsIn(room)
            searchJobsUtility.energyRelated.postJobControllerUpgrade(room)
        },

        postJobForSourcesIn: function(room) {
            // console.log('searchJobsUtility.postJobForSourcesIn: in room ' + room.name)

            let sources = room.find(FIND_SOURCES)
            // console.log(sources)

            function checkAndPostJob(source) {
                // console.log(source)
                // console.log(room.memory.sources[source.id].spaceCounter)

                if (room.memory.sources === undefined) { room.memory.sources = {} }
                if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
                if (room.memory.sources[source.id].jobsLinked === undefined) {
                    console.log('created jobsLinked')
                    room.memory.sources[source.id].jobsLinked = []
                }
                let freeSpace = room.memory.sources[source.id].spaceCounter
                let jobsLinked = room.memory.sources[source.id].jobsLinked

                var harvestExistingCount = 0
                var harvestExistingPureCount = 0
                for (i in jobsLinked) {
                    // let job = Memory.jobs[jobsLinked[i]]
                    // console.log(job.jobTypeId, job.id)
                    let name = jobsLinked[i]
                    let jobTypeId = name.split('_')[1]
                    // console.log(jobTypeId)
                    if (jobTypeId == JOBS.HARVEST) {
                        harvestExistingCount++
                    } else if (jobTypeId == JOBS.HARVEST_PURE ) {
                        harvestExistingPureCount++
                    } else {
                        console.log('jobScheduler.checkAndPostJob: in correct placement of job ' + name)
                    }
                }

                // console.log('existing counts ', harvestExistingCount, harvestExistingPureCount)

                let containersNearby = room.memory.sources[source.id].containersNearby
                // console.log('checking to post jobs for: ' + source + ' has ' + freeSpace + ', ' + containersNearby.length)


                let totalJobCount = freeSpace
                var containersNearbyCount = 0
                if (containersNearby !== undefined) { containersNearbyCount = containersNearby.length }
                let containerJobCount = Math.max(0, containersNearbyCount - harvestExistingPureCount)
                let freeSpaceJobCount = Math.max(0, (totalJobCount - containersNearbyCount) - harvestExistingCount)

                let jobEnergyShare = source.energy / totalJobCount
                // console.log(jobEnergyShare)


                function harvestJobTemplate() {
                    var harvestJob = new Contract()
                    // harvestJob.deadline = Game.time + 200 + utility.general.getRandomInt(-30,30)
                    harvestJob.target = source.id
                    harvestJob.amount = jobEnergyShare
                    return harvestJob
                }

                // console.log('counts ', freeSpaceJobCount, containerJobCount)

                // just normal energy jobs
                for(var freeSpaceJobIndex = 0; freeSpaceJobIndex < freeSpaceJobCount; freeSpaceJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.jobTypeId = JOBS.HARVEST
                    // console.log('id = ', harvestJob.jobTypeId)
                    jobScheduler.postJob(harvestJob)
                    // room.memory.sources[source.id].jobsLinked[0]++
                }

                // console.log('got after the loop !!!!!!!!!!!', containerJobCount)
                // container coordination jobs
                for(var containerJobIndex = 0; containerJobIndex < containerJobCount; containerJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.jobTypeId = JOBS.HARVEST_PURE
                    // console.log('container ', room.sources[source.id].containersNearby[containerJobIndex])
                    // console.log('id = ', harvestJob.jobTypeId)
                    harvestJob.container = containersNearby[containerJobIndex]
                    jobScheduler.postJob(harvestJob)
                    // room.memory.sources[source.id].jobsLinked[1]++
                }
            }


            for (i in sources) {
                let source = sources[i]
                checkAndPostJob(source)
                // console.log(source)
            }
        },

        postJobForStructuresIn: function(room) {
            // console.log('jobScheduler.postJobForStructuresIn: called on room ' + room.name)
            let structures = room.find(FIND_MY_STRUCTURES, { filter: utility.structureFilter.hasFreeEnergyCapacity })
            // let structures = room.find(FIND_MY_STRUCTURES)
            // console.log(structures)

            if (room.memory.structures === undefined) { room.memory.structures = {} }

            for (i in structures) {
                let structure = structures[i]
                // console.log(structure)
                if (room.memory.structures[structure.id] === undefined) { room.memory.structures[structure.id] = {} }
                if (room.memory.structures[structure.id].jobLinked !== undefined ) { continue }
                var job = new Contract(JOBS.TRANSFER)
                // job.deadline = Game.time + 200 + utility.general.getRandomInt(-30, 30)
                job.structure = structure.id
                job.resource = RESOURCE_ENERGY
                job.amount = structure.store.getFreeCapacity(RESOURCE_ENERGY)
                jobScheduler.postJob(job)
            }

        },

        postJobForConstructionsIn: function(room) {
            console.log('jobScheduler.postJobForConstructionsIn: called on room ' + room.name)
            let constructions = room.find(FIND_MY_CONSTRUCTION_SITES)
            if (room.memory.constructions === undefined) { room.memory.constructions = {} }
            for (i in constructions) {
                // console.log(site)
                let site = constructions[i]
                if (room.memory.constructions[site.id] === undefined) { room.memory.constructions[site.id] = {} }
                if (room.memory.constructions[site.id].jobLinked !== undefined) { continue }
                var job = new Contract(JOBS.BUILD)
                // console.log(room.memory.constructions[site.id].jobLined)
                // job.deadline = Game.time + utility.general.getRandomInt(12, 20)
                job.site = site.id
                job.resource = RESOURCE_ENERGY
                job.amount = site.progressTotal - site.progress
                jobScheduler.postJob(job)
            }
        },

        postJobControllerUpgrade: function(room) {
            let controller = room.controller
            if (! controller.my) { return }
            console.log('jobScheduler.postJobControllerUpgrade: called on ' + controller.id + ' in room ' + room.name)
            if (room.memory.controllerJobs === undefined) { room.memory.controllerJobs = [] }
            let jobsScheduledCount = room.memory.controllerJobs.length
            let level = controller.level
            if (jobsScheduledCount > level) { return }

            // console.log(level)
            var job = new Contract(JOBS.UPGRADE_RC)
            job.controller = controller.id
            jobScheduler.postJob(job)
        }



    },

    spawnsRelated: {
        run: function() {
            console.log('jobScheduler.spawnsRelated: called 🏩')
            for (i in Game.spawns) {
                let spawn = Game.spawns[i]
                // console.log(spawn)
                searchJobsUtility.spawnsRelated.findJobsMySpawn(spawn)
            }
            // TODO: enemy spawn
        },

        findJobsMySpawn: function(spawn) {
            // if (!spawn.my) { console.log('❗️❗️jobScheduler.findJobsMySpawn: NOT MINE'); return }
            let energy = utility.countEnergy(spawn)
            console.log('jobScheduler.findJobsMySpawn: called on ' + spawn.name, ' E:', energy.available + ',', energy.capacity + ')')
            if (spawn.memory.jobsLinked === undefined) { spawn.memory.jobsLinked = [] }

            function starterActions() {
                let creeps = spawn.room.find(FIND_MY_CREEPS)
                if (spawn.memory.jobsLinked.length > 4) { return }
                if (creeps.length < 4) {
                    // console.log('ahh')
                    var job = new Contract(JOBS.SPAWN)
                    job.spawn = spawn.id
                    job.spec = CONSTANTS.CREEPS_SPECS.WORKER
                    jobScheduler.postJob(job)
                }
            }

            if (spawn.room.controller.level < 5) {
                starterActions()
            } else {
                console.log('❗️❗️jobScheduler.findJobsMySpawn: HAVE NOT IMPLEMENT THIS YOU LAZY!')
                starterActions()
            }

        },

    }

}


class Contract {

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

        // this.validateCallBack = undefined // called routinely or by finished shared task
        // this.assignedCallBack = undefined
        // this.finishedCallBack = undefined
        // this.removedCallBack = undefined

    }

}
