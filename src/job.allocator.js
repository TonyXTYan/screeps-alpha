var utility = require('utility');
var jobUtility = require('job.utility')
var jobScheduler = require('job.scheduler')
var CONSTANTS = require('constants')
var CONTRACTS = jobUtility.CONTRACTS



var jobAllocator = {
    run: function() {
        // if (Game.time % CONSTANTS.FREQ_HIGH = 1) {
            jobAllocator.creepRelated.run()
            jobAllocator.spawnsRelated.run()
        // }
    },

    spawnsRelated: {
        run: function() {
            console.log('jobAllocator.spawnsRelated.run: called')
            jobAllocator.spawnsRelated.spawnCreep()
        },

        spawnCreep() {
            // let spawnContracts = Memory.jobs.contracts[CONTRACTS.SPAWN]
            // for (let k in spawnContracts) {
            function allocate(job) {
                // console.log('jobAllocator.spawnCreep.allocate: called on job ' + job.id)
                // let job = spawnContracts[k]
                if (job === undefined) { return }
                // console.log(job)
                // console.log(job.id)
                let jobSpawn = Game.getObjectById(job.spawn)
                // console.log(jobSpawn.name, jobSpawn.spawning)
                if (jobSpawn.spawning) { return }
                if (jobSpawn.memory.currentJob !== undefined ) {
                    let jobId = jobSpawn.memory.currentJob
                    let job = Memory.jobs.contracts[CONTRACTS.SPAWN][jobId]
                    // console.log(job)
                    if (job === undefined) {
                        jobSpawn.memory.currentJob = undefined
                    } else { return }
                }

                // jobSpawn.spawnCreep()

                let energy = jobSpawn.room.energyAvailable
                if (energy < 300) { return }


                // if (jobSpawn.spawning === null) {
                if (jobSpawn.room.controller.level > CONSTANTS.STARTER_LEVEL) {
                    console.log('❗️❗️jobAllocator.checkSpawn: TODO: TIME TO FIX THIS ')
                }
                // console.log('jobAllocator.spawnsRelated: can spawn')
                let spec = utility.balanceSpec(CONSTANTS.CREEPS_SPECS.WORKER, energy)
                console.log('jobAllocator.spawnsRelated: bodySpec ' + spec)
                job.bodySpec = spec
                jobScheduler.assignedJob(job)
                // } // else { continue }
            }

            jobUtility.mapJobsType(CONTRACTS.SPAWN, allocate)
        }


    },

    creepRelated: {
        run: function() {
            console.log('jobAllocator.creepRelated: called')
            // jobUtility.mapJobsType(CONTRACTS.BUILD, jobAllocator.creepRelated.checkBuild)
            // jobUtility.mapJobsType(CONTRACTS.TRANSFER, jobAllocator.creepRelated.checkTransfer)
            jobUtility.mapJobsType(CONTRACTS.HARVEST, jobAllocator.creepRelated.checkHarvest)
            // jobUtility.mapJobsType(CONTRACTS.HARVEST_PURE, jobAllocator.creepRelated.checkHarvestPure)
        },

        checkHarvest: function(job) {
            console.log('jobAllocator.checkHarvest: ' + job.id)
            // let preferredSpec = CONSTANTS.CREEPS_SPECS.WORKER
            // let creeps

        },

        checkHarvestPure: function(job) {
            console.log('jobAllocator.checkHarvestPure: ' + job.id)
            console.log('❗️jobAllocator.checkHarvestPure: HAVE NOT IMPLEMENT THIS YET')

        },

        checkBuild: function(job) {
            console.log('jobAllocator.checkHarvestBuild: ' + job.id)


        },

        checkTransfer: function(job) {
            console.log('jobAllocator.checkHarvestTransfer: ' + job.id)


        },


    }
}

module.exports = jobAllocator


// var job
