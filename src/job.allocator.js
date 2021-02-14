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

                // console.log(spawn.memory.jobsLinked)
                if (job === undefined) {
                    console.log('jobAllocator.signupJobForSpawns: job undefined')
                    // if (spawn.memory.currentJob) {
                    let array = spawn.memory.jobsLinked
                    let replacement = utility.general.arrayDeleteOne(array, jobId)
                    spawn.memory.jobsLinked = replacement
                    // }
                    spawn.memory.currentJob = undefined
                    return
                }

                let energyAvailable = spawn.room.energyAvailable
                if (energyAvailable < 300) { return } // don't bother

                // let spec = [1,1,1,0 ,0,0,0,0] // FIXME

                console.log('jobAllocator.signupJobForSpawns: ' + job.id + ' linked spec ' + job.creepSpecId)
                // job.bodySpec = jobContract.

                jobContract.assignedJob(job)
            }
        },

    },

    creepRelated: {
        run: function() {
            console.log('jobAllocator.creepRelated: called')
            jobUtility.mapJobsType(CONTRACT.UPGRADE_RC.id, jobAllocator.creepRelated.checkUpgradeRc)
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
            let creep = target.pos.findClosestByPath(FIND_MY_CREEPS, { filter: function(creep) {
                return ((!creep.memory.jobLinked) &&
                        // (creep.room.id == room.id) &&
                        (creep.store.getFreeCapacity() > 0))
            } })
            // let creeps = room.find(FIND_MY_CREEPS, { filter: function(creep) {
            //     return ((!creep.memory.jobLinked) &&
            //             // (creep.room.id == room.id) &&
            //             (creep.store.getFreeCapacity() > 0))
            // } })
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

            // let creep = creeps[0]
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
            if (job.creepId) { return }
            let site = Game.getObjectById(job.site)
            if (site == null) { jobContract.removeJob(job); return }
            let room = site.room
            let creep = site.pos.findClosestByPath(FIND_MY_CREEPS, { filter: function(creep) {
                return ((!creep.memory.jobLinked) &&
                        // (creep.room.id == room.id) &&
                        (creep.store.getUsedCapacity(RESOURCE_ENERGY) >= 50))
            } })
            // let creeps = room.find(FIND_MY_CREEPS, { filter: function(creep) {
            //     return ((!creep.memory.jobLinked) &&
            //             // (creep.room.id == room.id) &&
            //             (creep.store.getUsedCapacity(RESOURCE_ENERGY) >= 50))
            // } })
            // // console.log('available creeps: ' + creeps.length)
            // let creep = creeps[0]
            if (!creep) { return }
            console.log('jobAllocator.checkBuild: ' + job.id + ' assigned to ' + creep.name)

            job.creepId = creep.id
            jobContract.assignedJob(job)
        },

        checkTransfer: function(job) {
            console.log('jobAllocator.checkHarvestTransfer: ' + job.id)

        },

        checkUpgradeRc: function(job) {
            // console.log('jobAllocator.checkUpgradeRc: ' + job.id)
            if (job.creepId) { return }
            let controller = Game.getObjectById(job.controller)
            let room = controller.room
            let creeps = room.find(FIND_MY_CREEPS, { filter: function(creep) {
                return ((!creep.memory.jobLinked) &&
                (creep.store.getUsedCapacity(RESOURCE_ENERGY) >= 50))
            }})
            // console.log('jobAllocator.checkUpgradeRc: ' + creeps.length)
            let creep = creeps[0]
            if (!creep) { return }
            job.creepId = creep.id
            jobContract.assignedJob(job)
        },


        checkRepair: function(job) {
            console.log('jobAllocator.checkRepair: ' + job.id)

        },

    }
}

module.exports = jobAllocator


// var job
