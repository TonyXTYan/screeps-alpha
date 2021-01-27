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
                if (job.validateCallBack === undefined) {
                    console.log('jobScheduler.validateRoutine: FORCED REMOVE due to validateCallBack undefined ⚠️⚠️⚠️⚠️⚠️⚠️⚠️' )
                    jobScheduler.removeJob(job)
                } else if (job.deadline + 2000 > Game.time) { // FIXME: task manager
                    console.log('jobScheduler.validateRoutine: FORCED timeout remove ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️' )
                    jobScheduler.removeJob(job)
                } else {
                    job.validateCall()
                }
            }
        }
    },


    searchJobs: searchJobsUtility,

    removeJob: function(job) {
        if (job.removedCallBack === undefined) {
            console.log('jobScheduler.removeJob: forced id = ' + job.id)
            Memory.jobs[job.id] = undefined
        } else {
            console.log('jobScheduler.removeJob: calledBack id = ' + job.id)
            job.removedCallBack(job)
        }
    },

    postJob: function(job){
        let id = Game.time + '_' + job.kind.id + '_' + Memory.jobsCreatedThisTick
        Memory.jobsCreatedThisTick++
        job.id = id
        Memory.jobs[id] = job
        console.log(job.validateCallBack === undefined)
        console.log(Memory.jobs[id].validateCallBack === undefined)
        console.log('jobScheduler.postJob: id = ' + id)
    }

}

module.exports = jobScheduler

let JOBS = {
    // GET RESOURCES
    // harvest energy from source or minerals from deposits.
    HARVEST:        { id: 0, parts: [WORK] },
    // // harvest and drop immediately to container
    HARVEST_PURE:   { id: 1, parts: [WORK] },
    WITHDRAW:       { id: 4, parts: [] },
    PICKUP:         { id: 6, parts: [CARRY] }, //
    DISMANTLE:      { id: 8, parts: [WORK] }, //

    // PUT RESOURCES
    BUILD:          { id: 10, parts: [WORK, CARRY] },
    UPGRADE_RC:     { id: 12, parts: [WORK, CARRY] },
    TRANSFER:       { id: 14, parts: [CARRY] },
    DROP:           { id: 16, parts: [CARRY] }, // Drop on top of ground or container

    // CREEP OR TOWER ish
    ATTACK:         { id: 20, parts: [ATTACK] },
    // ATTACK_RANGED:  { }
    ATTACK_MASS:    { id: 21, parts: [RANGED_ATTACK] },
    HEAL:           { id: 24, parts: [HEAL] }, // heal creeps
    REPAIR:         { id: 26, parts: [WORK, CARRY] }, // repair structure

    // TRANSPORT
    MOVE:           { id: 30, parts: [MOVE] },
    // PULLER: {id: , parts: []}, // TODO: check this
    // PULLED: {id: , parts: []},

    // OTHER
    CLAIM:          { id: 80, parts: [CLAIM] },
    RESERVE_RC:     { id: 84, parts: [CLAIM] },

    // SPAWN ACTION
    SPAWN:          { id: 100 },
    RECYCLE:        { id: 110 },
    RENEW:          { id: 120 },

    // ROOM CONTROLLER
    SAFE_MODE:      { id: 200 },
    UNCLAIM:        { id: 201 },

    // OTHER STUFF
    LINK_TRANSFER:  { id: 300 },

    CPU_PIXEL:      { id: 400 },
    CPU_UNLOCK:     { id: 410 }

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
            console.log('searchJobsUtility.energyRelated: in room ' + room.name)

            // console.log(room instanceof Room)
            // console.log(room.controller.owner.username)
            // console.log(searchJobsUtility.energyTargets(room).length)

            // console.log(room.find(FIND_MY_STRUCTURES).length) // this does not include container
            // console.log(room.find(FIND_MY_CONSTRUCTION_SITES).length)
            // console.log(room.find(FIND_SOURCES).length)
            searchJobsUtility.energyRelated.postJobForSourcesIn(room)

        },

        postJobForSourcesIn: function(room) {
            console.log('searchJobsUtility.postJobForSourcesIn: in room ' + room.name)

            let sources = room.find(FIND_SOURCES)
            // console.log(sources)

            function postJob(source) {
                // console.log(room.memory.sources)
                // console.log(room.memory.sources[source.id].spaceCounter)

                if (room.memory.source[source.id].jobs === undefined) { room.memory.source[source.id].jobs = 0 }

                let freeSpace = room.memory.sources[source.id].spaceCounter

                if (room.memory.source[source.id].jobs >= freeSpace) { return }

                let containersNearby = room.memory.sources[source.id].containersNearby

                // console.log('checking to post jobs for: ' + source + ' has ' + freeSpace + ', ' + containersNearby.length)

                let totalJobCount = freeSpace
                let containerJobCount = containersNearby.length
                let freeSpaceJobCount = totalJobCount - containerJobCount

                // console.log(containerJobCount, freeSpaceJobCount)

                let jobEnergyShare = source.energy / totalJobCount
                // console.log(jobEnergyShare)



                function harvestJobTemplate() {
                    var validateCallBack = function(harvestJob) {
                        console.log('harvestJob.validateCall: called when ' + Game.time)
                        if (Game.time > harvestJob.deadline) {
                            jobScheduler.removeJob(harvestJob)
                        }
                    }

                    function assignedCallBack(harvestJob) {
                        // check if need and have slots to post a new job
                        console.log('harvestJob.assignedCallBack: called by ' + harvestJob.assignedTo)
                    }

                    function finishedCallBack(harvestJob) {
                        // check if need (and can) post a new job
                        console.log('harvestJob.finishedCallBack: called by ' + harvestJob.assignedTo)
                        removedCallBack(harvestJob)
                    }

                    function removedCallBack(harvestJob) {
                        // called when Game.time is after the deadline
                        console.log('harvestJob.removedCallBack: called ' + Game.time)

                    }
                    var harvestJob = new Contract()
                    harvestJob.deadline = Game.time + 20
                    harvestJob.target = source.id
                    harvestJob.amount = jobEnergyShare

                    // console.log(validateCall)
                    harvestJob.validateCallBack = validateCallBack
                    // console.log(harvestJob.validateCall)
                    harvestJob.removedCallBack = removedCallBack
                    return harvestJob
                }

                // console.log(harvestJob.id)
                // console.log(Object.get)

                // just normal energy jobs
                for(var freeSpaceJobIndex = 0; freeSpaceJobIndex < freeSpaceJobCount; freeSpaceJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.kind = JOBS.HARVEST
                    jobScheduler.postJob(harvestJob)
                }

                // container coordination jobs
                for(var containerJobIndex = 0; containerJobCount < containerJobCount; containerJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.kind = JOBS.HARVEST_PURE
                    harvestJob.container = containersNearby[containerJobIndex]
                    jobScheduler.postJob(harvestJob)
                }

                // Memory.jobs.push(harvestJob)/


                // var jobTest = new Contract(JOBS.HARVEST)
                // jobTest.target = source.id
                //
                // // console.log(jobTest)
                // // console.log(jobTest.createdTime)
                // // console.log(jobTest.deadline)
                //
                // jobTest.deadline = Game.time + 100
                // // console.log(jobTest.deadline)
                // // console.log(jobTest.target)
                // // console.log(jobTest)

            }


            for (i in sources) {
                let source = sources[i]
                postJob(source)
                // console.log(source)
            }
        },



    },
}




class Contract {

    /**
     * constructor - description
     *
     * @param  {number} kind of contract
     * @param  {number} deadline of game tick time that the task need to finish before
     * @return {Contract}      description
     */

    //
    constructor(kind) {
        /**
         * test documentation
         * @type {number}
         */
        this.id = undefined
        this.contractKind = kind

        this.createdTime = Game.time
        this.deadline = Game.time
        // this.absoluteInvalidTime = Number.MAX_SAFE_INTEGER
        this.assignedTo = undefined

        this.validateCallBack = undefined // called routinely or by finished shared task
        this.assignedCallBack = undefined
        this.finishedCallBack = undefined
        this.removedCallBack = undefined

    }

}
