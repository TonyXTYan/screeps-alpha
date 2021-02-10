var utility = require('utility');
var jobUtility = require('job.utility')
// var jobScheduler = require('job.')
var CONSTANTS = require('constants')
var RETURN = CONSTANTS.RETURN
var CONTRACTS = jobUtility.CONTRACTS
var Contract = jobUtility.Contract
// let OK = 0

var jobScheduler = {


    /**
     * run - Call this every tick to attempt schedule task
     * FIXME: use task manager to schedule CPU jobs as well
     */
    run: function() {
        let currentTick = Game.time
        // console.log('jobScheduler: called')

        // console.log(CONTRACTS.BUILD === CONTRACTS.BUILD)
        // console.log(CONTRACTS.BUILD === CONTRACTS.ATTACK)

        if (Game.time % CONSTANTS.FREQ_MID == 0) { // FIXME: here
            searchJobsUtility.runAll()
        }

        jobScheduler.validationRoutine()
    },
    // do storage and arrage the contracts


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



    // searchJobs: searchJobsUtility, // TODO: check that I can remove this


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
            removeFromMemory()
        } else if (job.deadline + CONSTANTS.ALL_JOB_TIMEOUT < Game.time) {
            console.log('❗️jobScheduler.removeJob: VERY FORCED id = ' + job.id + ' btw code ' + code)
            removeFromMemory()
        } else if (code == RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL) {
            console.log('❕jobScheduler.removeJob: got invalid memory addres')
            removeFromMemory()
            memoryValidation.fullAudit() // break this down a bit
        } else {
            console.log('❗️jobScheduler.removeJob: forced id = ' + job.id + ' with code ' + code)
            removeFromMemory()
        }
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

    memoryValidation: memoryValidation
}

module.exports = jobScheduler




var memoryValidation = { // TODO: This
    fullAudit: function() {
        console.log('⁉️⁉️jobScheduler.fullAudit: TODO THIS 📛📛💯⁉️')
    },

    auditJobTypeMemory: function(jobTypeId) {

    },

    checkSourceHarvestJobs: function() {

    },
}


/**
 * The call back functions to complete job specific things
 */
var jobCallBack = {
    created: function(job) {
        // console.log(job)
        switch(job.jobTypeId) {
            case (CONTRACTS.HARVEST):
            case (CONTRACTS.HARVEST_PURE): {
                let target = Game.getObjectById(job.target)
                // if (target === undefined) { return -2 }
                target.room.memory.sources[job.target].jobsLinked.push(job.id)
                return OK
            };
            case (CONTRACTS.TRANSFER): {
                let structure = Game.getObjectById(job.structure)
                // if (structure === undefined) { return -2 }
                structure.room.memory.structures[job.structure].jobTransferLinked = job.id
                return OK
            }
            case (CONTRACTS.BUILD): {
                let site = Game.getObjectById(job.site)
                // if (site === undefined) { return -2 }
                site.room.memory.constructions[job.site].jobLinked = job.id
                return OK
            }
            case (CONTRACTS.UPGRADE_RC): {
                let controller = Game.getObjectById(job.controller)
                // if (controller === undefined) { return -2 }
                controller.room.memory.controllerJobs.push(job.id)
                return OK
            };
            case (CONTRACTS.SPAWN): {
                let spawn = Game.getObjectById(job.spawn)
                // if (spawn === undefined) { return -2 }
                spawn.memory.jobsLinked.push(job.id)
                return OK
            };
            case (CONTRACTS.REPAIR): {
                let structure = Game.getObjectById(job.structure)
                // if (structure === null)
                structure.room.memory.structures[job.structure].jobRepairLinked = job.id
                return OK
            };
            default: return RETURN.ERR_BEHAVIOUR_UNDEF
        }
    },

    validate: function(job) {
        // console.log('jobCallBacks.validateCallBack: called on job id ' + job.id)
        // console.log(CONTRACTS.HARVEST.id == job.)
        switch(job.jobTypeId) {
            case (CONTRACTS.HARVEST):
            case (CONTRACTS.HARVEST_PURE):
            case (CONTRACTS.TRANSFER):
            case (CONTRACTS.BUILD):
            case (CONTRACTS.UPGRADE_RC):
            case (CONTRACTS.SPAWN):
            case (CONTRACTS.REPAIR):
            {
                if (job.deadline + 10 < Game.time && job.assignedTo === undefined) {
                    // console.log('jobCallBacks.validate: ' + job.id)
                    jobScheduler.removeJob(job)
                }
                return OK
            };
            default: return RETURN.ERR_BEHAVIOUR_UNDEF

        }
    },

    assigned: function(job) {
        switch(job.jobTypeId) {
            case (CONTRACTS.SPAWN): {
                // let jobTypeId
                // let job = Memory.jobs.contracts[job.jobTypeId]
                if (job.bodySpec === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                // let bodySpec = job.bodySpec
                let spawn = Game.getObjectById(job.spawn)
                spawn.memory.currentJob = job.id

                return RETURN.ERR_I_AM_WORKING_ON_IT
            };
            default: return RETURN.ERR_BEHAVIOUR_UNDEF
        }
    },

    completed: function(job) {
        switch(job.jobTypeId) {
            case (CONTRACTS.SPAWN): {
                // if (job.bodySpec === undefined) { return RETURN.ERR_MEMORY_REQUIRED_UNDEF }
                let spawn = Game.getObjectById(job.spawn)
                spawn.memory.currentJob = undefined
                // jobScheduler.removeJob(job)
                return RETURN.DELETE_THIS_JOB
            };
            default: return RETURN.ERR_BEHAVIOUR_UNDEF
        }
        // return RETURN.ERR_BEHAVIOUR_UNDEF
    },

    removing: function(job) {
        // don't touch Memory.jobs, that's done after this function
        // console.log('jobScheduler.jobCallBack.removed: on ' + job.id )
        switch(job.jobTypeId){
            case (CONTRACTS.HARVEST):
            case (CONTRACTS.HARVEST_PURE): {
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
            };
            case (CONTRACTS.TRANSFER): {
                let structure = Game.getObjectById(job.structure)
                if (structure === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                structure.room.memory.structures[structure.id].jobTransferLinked = undefined
                return OK
            };
            case (CONTRACTS.BUILD): {
                let site = Game.getObjectById(job.site)
                if (site === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                site.room.memory.constructions[site.id].jobLinked = undefined
                return OK
            };
            case (CONTRACTS.UPGRADE_RC): {
                let controller = Game.getObjectById(job.controller)
                if (controller === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                let array = controller.room.memory.controllerJobs
                let replacement = utility.general.arrayDeleteOne(array, job.id)
                controller.room.memory.controllerJobs = replacement
                return OK
            };
            case (CONTRACTS.SPAWN): {
                let spawn = Game.getObjectById(job.spawn)
                if (spawn === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                let array = spawn.memory.jobsLinked
                let replacement = utility.general.arrayDeleteOne(array, job.id)
                spawn.memory.jobsLinked = replacement
                return OK
            };
            case (CONTRACTS.REPAIR): {
                let structure = Game.getObjectById(job.structure)
                if (structure === null) { return RETURN.ERR_MEMORY_ADDRESS_RETURNS_NULL }
                structure.room.memory.structures[structure.id].jobRepairLinked = undefined
                return OK
            };
            default: return RETURN.ERR_BEHAVIOUR_UNDEF
        }
    }
}

var searchJobsUtility = {
    runAll: function() {
        utility.runForAllRooms(searchJobsUtility.energyRelated.run)
        utility.runForAllRooms(searchJobsUtility.damageRelated.run)
        searchJobsUtility.spawnsRelated.run()
    },

    energyRelated:  {
        run: function(room) {
            // get: harvest, withdraw
            // put: build, upgrade, transfers
            // console.log('jobScheduler.searchJobsUtility.energyRelated: called 🌕')
            searchJobsUtility.energyRelated.postJobForSourcesIn(room)
            searchJobsUtility.energyRelated.postJobForStructuresIn(room)
            searchJobsUtility.energyRelated.postJobForConstructionsIn(room)
            searchJobsUtility.energyRelated.postJobControllerUpgrade(room)
        },

        postJobForSourcesIn: function(room) {
            console.log('jobScheduler.postJobForSourcesIn: 🟨 in room ' + room.name)

            let sources = room.find(FIND_SOURCES)
            // console.log(sources)

            function checkAndPostJob(source) {
                // console.log(source)
                // console.log(room.memory.sources[source.id].spaceCounter)
                if (source.energy < 50) { console.log('➰jobScheduler: postJobForSourcesIn: skip depleted'); return }
                if (room.memory.sources === undefined) { room.memory.sources = {} }
                if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
                if (room.memory.sources[source.id].jobsLinked === undefined) {
                    // console.log('created jobsLinked')
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
                    // let job = Memory.jobs.contracts
                    let jobTypeId = name.split('_')[0]
                    // let jobTypeId =
                    // console.log(jobTypeId)
                    if (jobTypeId == CONTRACTS.HARVEST) {
                        harvestExistingCount++
                    } else if (jobTypeId == CONTRACTS.HARVEST_PURE ) {
                        harvestExistingPureCount++
                    } else {
                        console.log('jobScheduler.checkAndPostJob: incorrect placement of job ' + name)
                    }
                }
                // if (Memory.jobs.contracts[job.])

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
                    harvestJob.jobTypeId = CONTRACTS.HARVEST
                    // console.log('id = ', harvestJob.jobTypeId)
                    jobScheduler.postJob(harvestJob)
                    // room.memory.sources[source.id].jobsLinked[0]++
                }

                // console.log('got after the loop !!!!!!!!!!!', containerJobCount)
                // container coordination jobs
                for(var containerJobIndex = 0; containerJobIndex < containerJobCount; containerJobIndex++) {
                    var harvestJob = harvestJobTemplate()
                    harvestJob.jobTypeId = CONTRACTS.HARVEST_PURE
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
            console.log('jobScheduler.postJobForStructuresIn: 📦 called on room ' + room.name)
            let structures = room.find(FIND_MY_STRUCTURES, { filter: utility.structureFilter.hasFreeEnergyCapacity })
            // let structures = room.find(FIND_MY_STRUCTURES)
            // console.log(structures)

            if (room.memory.structures === undefined) { room.memory.structures = {} }

            for (i in structures) {
                let structure = structures[i]
                // console.log(structure)
                if (room.memory.structures[structure.id] === undefined) { room.memory.structures[structure.id] = {} }
                if (room.memory.structures[structure.id].jobTransferLinked !== undefined ) { continue }
                var job = new Contract(CONTRACTS.TRANSFER)
                // job.deadline = Game.time + 200 + utility.general.getRandomInt(-30, 30)
                job.structure = structure.id
                job.resource = RESOURCE_ENERGY
                job.amount = structure.store.getFreeCapacity(RESOURCE_ENERGY)
                // console.log('posted')
                jobScheduler.postJob(job)
            }

        },

        postJobForConstructionsIn: function(room) {
            console.log('jobScheduler.postJobForConstructionsIn: 🏗 called on room ' + room.name)
            let constructions = room.find(FIND_MY_CONSTRUCTION_SITES)
            if (room.memory.constructions === undefined) { room.memory.constructions = {} }
            for (i in constructions) {
                // console.log(site)
                let site = constructions[i]
                if (room.memory.constructions[site.id] === undefined) { room.memory.constructions[site.id] = {} }
                if (room.memory.constructions[site.id].jobLinked !== undefined) { continue }
                var job = new Contract(CONTRACTS.BUILD)
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
            console.log('jobScheduler.postJobControllerUpgrade: 🔼 called on room ' + room.name)
            if (room.memory.controllerJobs === undefined) { room.memory.controllerJobs = [] }
            let jobsScheduledCount = room.memory.controllerJobs.length
            let level = controller.level
            if (jobsScheduledCount > level) { return }

            // console.log(level)
            var job = new Contract(CONTRACTS.UPGRADE_RC)
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
            // let energy = utility.countEnergy(spawn)
            // console.log('jobScheduler.findJobsMySpawn:  on ' + spawn.name, ' E:', energy.available + ',', energy.capacity + ')')
            // console.log('jobScheduler.findJobsMySpawn: on ' + spawn.name)
            if (spawn.memory.jobsLinked === undefined) { spawn.memory.jobsLinked = [] }

            function starterActions() {
                let creeps = spawn.room.find(FIND_MY_CREEPS)
                if (spawn.memory.jobsLinked.length > 4) { return }
                let minersNeeded = utility.totalSourceSpots(spawn.room)
                // console.log('jobScheduler.findJobsMySpawn: needed ' + minersNeeded)
                if (creeps.length < Math.min(5, minersNeeded)) {
                    // console.log('ahh')
                    var job = new Contract(CONTRACTS.SPAWN)
                    job.spawn = spawn.id
                    job.spec = CONSTANTS.CREEPS_SPECS.WORKER
                    // job.creepJob =
                    jobScheduler.postJob(job)
                }
            }

            if (spawn.room.controller.level < CONSTANTS.STARTER_LEVEL) {
                starterActions()
            } else {
                console.log('❗️❗️jobScheduler.findJobsMySpawn: HAVE NOT IMPLEMENT THIS YOU LAZY!')
                starterActions()
            }

        },

    },

    damageRelated: {
        run: function(room) {
            console.log('jobScheduler.damageRelated.run: 🛠 called on ' + room.name)
            searchJobsUtility.damageRelated.repairStructures(room)
        },

        repairStructures: function(room) {
            if (room.controller.owner.username != Memory.myUsername) {
                // Without the controller, I cannot build structure in that room.
                // console.log('jobScheduler.repairStructures: not my room ' + room.name, room.controller.owner.username, Memory.myUsername)
                return
            } // not my room, i don't care
            let targets = room.find(FIND_STRUCTURES, { filter: utility.structureFilter.needRepair })
            // console.log(targets.length)

            for (let i in targets) {
                let target = targets[i]
                // console.log(target)
                if (room.memory.structures === undefined) { room.memory.structures = {} }
                if (room.memory.structures[target.id] === undefined) { room.memory.structures[target.id] = {} }
                // if (room.memory.structure[target.id].jobRepairLinked === undefined) { room.memory.structure[target.id].jobRepairLinked = {} }
                if (room.memory.structures[target.id].jobRepairLinked !== undefined) { continue }
                var job = new Contract(CONTRACTS.REPAIR)
                job.structure = target.id
                jobScheduler.postJob(job)
            }


        },

        healCreeps: function(room) {
            // FIXME:
            // TODO:
        },


    },






}
