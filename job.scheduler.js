var utility = require('utility');


var jobScheduler = {

    run: function() {
        let currentTick = Game.time
        // console.log(' ')
        console.log('contractScheduler: called')

        // console.log(JOBS.BUILD === JOBS.BUILD)
        // console.log(JOBS.BUILD === JOBS.ATTACK)

        if (Game.time % 10 == 0) {
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
                if (job.deadline + 3000 < Game.time) {
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
        // if (job.removedCallBack === undefined) {
        //     console.log('jobScheduler.removeJob: forced id = ' + job.id)
        //     Memory.jobs[job.id] = undefined
        // } else {
        //     console.log('jobScheduler.removeJob: calledBack id = ' + job.id)
        //     job.removedCallBack(job)
        // }
        let code = jobCallBack.removing(job)
        if (code == -1) {
            console.log('jobScheduler.removeJob: forced id = ' + job.id)
            Memory.jobs[job.id] = undefined
        } else if (job.deadline + 3000 < Game.time) {
            console.log('jobScheduler.removeJob: VERY FORCED id = ' + job.id)
            Memory.jobs[job.id] = undefined
        } else {
            // console.log('jobScheduler.removeJob: peacefully ' + job.id + ' with code: ' + code)
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
            console.log('jobScheduler.postJob: id = ' + id + ', callBack code: ' + code)
        }
    },


    memoryValidation: memoryValidation
}

module.exports = jobScheduler

let JOBS = {
    // GET RESOURCES
    // harvest energy from source or minerals from deposits.
    HARVEST:        { id: 100, parts: [WORK] },
    // // harvest and drop immediately to container
    HARVEST_PURE:   { id: 101, parts: [WORK] },
    WITHDRAW:       { id: 104, parts: [] },
    PICKUP:         { id: 106, parts: [CARRY] }, //
    DISMANTLE:      { id: 108, parts: [WORK] }, //

    // PUT RESOURCES
    BUILD:          { id: 110, parts: [WORK, CARRY] },
    UPGRADE_RC:     { id: 112, parts: [WORK, CARRY] },
    TRANSFER:       { id: 114, parts: [CARRY] },
    DROP:           { id: 116, parts: [CARRY] }, // Drop on top of ground or container

    // CREEP OR TOWER ish
    ATTACK:         { id: 120, parts: [ATTACK] },
    // ATTACK_RANGED:  { }
    ATTACK_MASS:    { id: 121, parts: [RANGED_ATTACK] },
    HEAL:           { id: 124, parts: [HEAL] }, // heal creeps
    REPAIR:         { id: 126, parts: [WORK, CARRY] }, // repair structure

    // TRANSPORT
    MOVE:           { id: 130, parts: [MOVE] },
    // PULLER: {id: , parts: []}, // TODO: check this
    // PULLED: {id: , parts: []},

    // OTHER
    CLAIM:          { id: 180, parts: [CLAIM] },
    RESERVE_RC:     { id: 184, parts: [CLAIM] },

    // SPAWN ACTION
    SPAWN:          { id: 200 },
    RECYCLE:        { id: 210 },
    RENEW:          { id: 220 },

    // ROOM CONTROLLER
    SAFE_MODE:      { id: 300 },
    UNCLAIM:        { id: 301 },

    // OTHER STUFF
    LINK_TRANSFER:  { id: 400 },

    CPU_PIXEL:      { id: 500 },
    CPU_UNLOCK:     { id: 510 }

}


var memoryValidation = {
    checkSourceHarvestJobs: function() {

    }
}

var jobCallBack = {
    created: function(job) {
        switch(job.jobTypeId) {
            case (JOBS.HARVEST.id):
            case (JOBS.HARVEST_PURE.id): {
                let target = Game.getObjectById(job.target)
                // var list =
                target.room.memory.sources[job.target].jobsLinked.push(job.id)
                // set.add(job.id)
                // console.log(set instanceof Set)
                // console.log(target)
                return 0
            };
            default: return -1
        }
    },

    validate: function(job) {
        // console.log('jobCallBacks.validateCallBack: called on job id ' + job.id)
        // console.log(JOBS.HARVEST.id == job.)
        switch(job.jobTypeId) {
            case (JOBS.HARVEST.id):
            case (JOBS.HARVEST_PURE.id): {
                if (job.deadline + 10 < Game.time && job.assignedTo === undefined) {
                    // console.log('jobCallBacks.validate: ' + job.id)
                    jobScheduler.removeJob(job)
                }
                return 0
            };
            default: {
                return -1
            }
        }
    },

    assigned: function(job) {

    },
    completed: function(job) {

    },
    removing: function(job) {
        // console.log('jobCallBack.removed: on ' + job.id )
        switch(job.jobTypeId){
            case (JOBS.HARVEST.id):
            case (JOBS.HARVEST_PURE.id): {
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
            default: return -1
        }
    }
}

var searchJobsUtility = {
    runAll: function() {
        utility.runForAllRooms(searchJobsUtility.energyRelated.run)
        // searchJobsUtility.searchEnergyRelated.run()
    },

    energyRelated:  {
        run: function(room) {
            // get: harvest, withdraw
            // put: build, upgrade, transfer
            // console.log('searchJobsUtility.energyRelated: in room ' + room.name)
            searchJobsUtility.energyRelated.postJobForSourcesIn(room)

        },

        postJobForSourcesIn: function(room) {
            console.log('searchJobsUtility.postJobForSourcesIn: in room ' + room.name)

            let sources = room.find(FIND_SOURCES)
            // console.log(sources)

            function checkAndPostJob(source) {
                // console.log(source)
                // console.log(room.memory.sources[source.id].spaceCounter)

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
                    if (jobTypeId == JOBS.HARVEST.id) {
                        harvestExistingCount++
                    } else if (jobTypeId == JOBS.HARVEST_PURE.id ) {
                        harvestExistingPureCount++
                    } else {
                        console.log('jobScheduler.checkAndPostJob: in correct placement of job ' + name)
                    }
                }

                // console.log('existing counts ', harvestExistingCount, harvestExistingPureCount)

                let containersNearby = room.memory.sources[source.id].containersNearby
                // console.log('checking to post jobs for: ' + source + ' has ' + freeSpace + ', ' + containersNearby.length)


                let totalJobCount = freeSpace
                let containerJobCount = Math.max(0, containersNearby.length - harvestExistingPureCount)
                let freeSpaceJobCount = Math.max(0, (totalJobCount - containersNearby.length) - harvestExistingCount)

                let jobEnergyShare = source.energy / totalJobCount
                // console.log(jobEnergyShare)


                function harvestJobTemplate() {
                    var harvestJob = new Contract()
                    harvestJob.deadline = Game.time + 200 + utility.general.getRandomInt(-30,30)
                    harvestJob.target = source.id
                    harvestJob.amount = jobEnergyShare
                    return harvestJob
                }

                // console.log('counts ', freeSpaceJobCount, containerJobCount)

                // just normal energy jobs
                for(var freeSpaceJobIndex = 0; freeSpaceJobIndex < freeSpaceJobCount; freeSpaceJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.jobTypeId = JOBS.HARVEST.id
                    // console.log('id = ', harvestJob.jobTypeId)
                    jobScheduler.postJob(harvestJob)
                    // room.memory.sources[source.id].jobsLinked[0]++
                }

                // console.log('got after the loop !!!!!!!!!!!', containerJobCount)
                // container coordination jobs
                for(var containerJobIndex = 0; containerJobIndex < containerJobCount; containerJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.jobTypeId = JOBS.HARVEST_PURE.id
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



    },
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
        this.deadline = Game.time
        // this.absoluteInvalidTime = Number.MAX_SAFE_INTEGER
        this.assignedTo = undefined

        // this.validateCallBack = undefined // called routinely or by finished shared task
        // this.assignedCallBack = undefined
        // this.finishedCallBack = undefined
        // this.removedCallBack = undefined

    }

}
