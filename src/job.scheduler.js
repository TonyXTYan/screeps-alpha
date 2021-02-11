var utility = require('utility');
var jobUtility = require('job.utility')
// var jobScheduler = require('job.')
var CONSTANTS = require('constants')
var RETURN = CONSTANTS.RETURN
var CONTRACTS = jobUtility.CONTRACTS
var jobContract = require('job.contract')
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

        if (Game.time % CONSTANTS.FREQ_MID == 0) { // FIXME: here
            searchJobsUtility.runAll()
        }

        jobContract.validationRoutine()
    },
    // do storage and arrage the contracts
    
}

module.exports = jobScheduler



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
                    jobContract.postJob(harvestJob)
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
                    jobContract.postJob(harvestJob)
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
                jobContract.postJob(job)
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
                jobContract.postJob(job)
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
            jobContract.postJob(job)
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
                    jobContract.postJob(job)
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
                jobContract.postJob(job)
            }


        },

        healCreeps: function(room) {
            // FIXME:
            // TODO:
        },


    },






}
