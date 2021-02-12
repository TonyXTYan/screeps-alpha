var utility = require('utility');
var jobUtility = require('job.utility')
var jobScheduler = require('job.scheduler')
var jobContract = require('job.contract')
var CONSTANTS = require('constants')
// var CONTRACTS = jobUtility.CONTRACTS
var CONTRACT = jobContract.CONTRACT


var jobAllocator = {
    run: function() {
        // if (Game.time % CONSTANTS.FREQ_HIGH = 1) {
        jobAllocator.creepRelated.run()
        jobAllocator.spawnsRelated.run()
        // }
    },

    spawnsRelated: {
        run: function() {
            // console.log('jobAllocator.spawnsRelated.run: called')
            // jobAllocator.spawnsRelated.spawnCreep()
            jobAllocator.spawnsRelated.signupJobForSpawns()
        },

        signupJobForSpawns: function() {
            // console.log('jobAllocator.signupJobForSpawns: called')
            for (let hash in Game.spawns) {
                let spawn = Game.spawns[hash]
                if (spawn.memory.currentJob) { continue }
                let jobsLinked = spawn.memory.jobsLinked
                // console.log(spawn.memory.jobsLinked)
                if (!jobsLinked) { continue }
                let jobId = jobsLinked[0]
                if (!jobId) { continue }
                let job = jobUtility.getJobFromId(jobId)

                let energyAvailable = spawn.room.energyAvailable
                if (energyAvailable < 300) { return } // don't bother

                let spec = [1,1,1,0 ,0,0,0,0] // FIXME

                console.log('jobAllocator.signupJobForSpawns: ' + job.id + ' linked spec ' + spec)
                job.bodySpec = spec
                jobContract.assignedJob(job)
            }
        },

        // spawnCreep: function() {
        //     // let spawnContracts = Memory.jobs.contracts[CONTRACTS.SPAWN]
        //     // for (let k in spawnContracts) {
        //     function allocate(job) {
        //         // console.log('jobAllocator.spawnCreep.allocate: called on job ' + job.id)
        //         // let job = spawnContracts[k]
        //         if (job === undefined) { return }
        //         // console.log(job)
        //         // console.log(job.id)
        //         let jobSpawn = Game.getObjectById(job.spawn)
        //         // console.log(jobSpawn.name, jobSpawn.spawning)
        //         if (jobSpawn.spawning) { return }
        //         if (jobSpawn.memory.currentJob !== undefined ) {
        //             let jobId = jobSpawn.memory.currentJob
        //             let job = Memory.jobs.contracts[CONTRACT.SPAWN.id][jobId]
        //             // console.log(job)
        //             if (job === undefined) {
        //                 jobSpawn.memory.currentJob = undefined
        //             } else { return }
        //         }
        //
        //         // jobSpawn.spawnCreep()
        //
        //         let energy = jobSpawn.room.energyAvailable
        //         if (energy < 300) { return } // don't bother
        //
        //
        //         // if (jobSpawn.spawning === null) {
        //         if (jobSpawn.room.controller.level > CONSTANTS.STARTER_LEVEL) {
        //             console.log('❗️❗️jobAllocator.checkSpawn: TODO: TIME TO FIX THIS ')
        //         }
        //
        //         // console.log('jobAllocator.spawnsRelated: can spawn')
        //         // let spec = jobUtility.bestBodyParts(CONTRACT.HARVEST.id, energy)
        //         let spec = [1,1,1,0, 0,0,0,0]
        //
        //         // ####### ### #     # #     # #######
        //         // #        #   #   #  ##   ## #
        //         // #        #    # #   # # # # #
        //         // #####    #     #    #  #  # #####
        //         // #        #    # #   #     # #
        //         // #        #   #   #  #     # #
        //         // #       ### #     # #     # #######
        //
        //         console.log('jobAllocator.spawnsRelated: bodySpec ' + spec)
        //         job.bodySpec = spec
        //         jobContract.assignedJob(job)
        //         // } // else { continue }
        //     }
        //
        //     jobUtility.mapJobsType(CONTRACT.SPAWN.id, allocate)
        // }


    },

    creepRelated: {
        run: function() {
            console.log('jobAllocator.creepRelated: called')
            jobUtility.mapJobsType(CONTRACT.BUILD.id, jobAllocator.creepRelated.checkBuild)
            // jobUtility.mapJobsType(CONTRACTS.TRANSFER, jobAllocator.creepRelated.checkTransfer)
            jobUtility.mapJobsType(CONTRACT.HARVEST.id, jobAllocator.creepRelated.checkHarvest)
            // jobUtility.mapJobsType(CONTRACTS.HARVEST_PURE, jobAllocator.creepRelated.checkHarvestPure)
        },

        checkHarvest: function(job) {
            if (job.creepId) { return }
            // console.log('jobAllocator.checkHarvest: ' + job.id)
            // let preferredSpec = CONSTANTS.CREEPS_SPECS.WORKER
            // let creeps

            let target = Game.getObjectById(job.target)
            // console.log(target, target.room)
            let room = target.room
            let creeps = room.find(FIND_MY_CREEPS, { filter: function(creep) {
                return ((!creep.memory.jobLinked) &&
                        // (creep.room.id == room.id) &&
                        (creep.store.getFreeCapacity() > 0))
            } })
            // console.log('available creeps: ' + creeps.length)


            // console.log(room.controller.level)
            if (room.controller.level > CONSTANTS.STARTER_LEVEL) {
            // ####### ####### ######  #######  #     ####### ### #     # #######    ####### #     # ###  #####
            //    #    #     # #     # #     # ###    #        #   #   #     #          #    #     #  #  #     #
            //    #    #     # #     # #     #  #     #        #    # #      #          #    #     #  #  #
            //    #    #     # #     # #     #        #####    #     #       #          #    #######  #   #####
            //    #    #     # #     # #     #  #     #        #    # #      #          #    #     #  #        #
            //    #    #     # #     # #     # ###    #        #   #   #     #          #    #     #  #  #     #
            //    #    ####### ######  #######  #     #       ### #     #    #          #    #     # ###  #####
                console.log('jobAllocator.checkHarvest: ‼️‼️THIS IS UNIMPLEMENTED')
            }

            let creep = creeps[0]
            if (!creep) { return }

            console.log('jobAllocator.checkHarvest: on job ' + job.id + ' assigned to creep ' + creep.name)

            // creep.memory.jobLinked = job.id
            job.creepId = creep.id
            jobContract.assignedJob(job)
        },

        checkHarvestPure: function(job) {
            console.log('jobAllocator.checkHarvestPure: ' + job.id)
            console.log('❗️jobAllocator.checkHarvestPure: HAVE NOT IMPLEMENT THIS YET')

        },

        checkBuild: function(job) {
            // console.log('jobAllocator.checkHarvestBuild: ' + job.id)
            let site = Game.getObjectById(job.site)
            let room = site.room
            let creeps = room.find(FIND_MY_CREEPS, { filter: function(creep) {
                return ((!creep.memory.jobLinked) &&
                        // (creep.room.id == room.id) &&
                        (creep.store.getUsedCapacity(RESOURCE_ENERGY) >= 50))
            } })
            // console.log('available creeps: ' + creeps.length)
            let creep = creeps[0]
            if (!creep) { return }
            console.log('jobAllocator.checkBuild: ' + job.id + ' assigned to ' + creep.name)

            job.creepId = creep.id
            jobContract.assignedJob(job)
        },

        checkTransfer: function(job) {
            console.log('jobAllocator.checkHarvestTransfer: ' + job.id)

        },

        checkUpgrade: function(job) {
            console.log('jobAllocator.checkUpgrade: ' + job.id)
        },


        checkRepair: function(job) {
            console.log('jobAllocator.checkRepair: ' + job.id)
        },

    }
}

module.exports = jobAllocator


// var job
