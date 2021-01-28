var utility = require('utility');
var jobUtility = require('job.utility')
var jobScheduler = require('job.scheduler')
var CONSTANTS = require('constants')
var CONTRACTS = jobUtility.CONTRACTS



var jobAllocator = {
    run: function() {
        // if (Game.time % CONSTANTS.FREQ_HIGH = 1) {
            // jobAllocator.allocateCreeps.run()
            jobAllocator.spawnsRelated.run()
        // }
    },

    allocateCreeps: {
        run: function() {
            utility.runForAllRooms(jobAllocator.allocateCreeps.checkRoom)
        },
        checkRoom: function(room){
            console.log('jobAllocator.allocateCreeps: on room ' + room.name)
            let creeps = room.find(FIND_MY_CREEPS)
            console.log(creeps)
        },
    },

    spawnsRelated: {
        run: function() {
            // for (i in Game.spawns) {
            //     jobAllocator.spawnsRelated.checkSpawn(Game.spawns[i])
            // }
            jobAllocator.spawnsRelated.spawnCreap()
        },

        spawnCreap() {
            let spawnContracts = Memory.jobs.contracts[CONTRACTS.SPAWN]
            for (let k in spawnContracts) {
                let job = spawnContracts[k]
                if (job === undefined) { continue }
                // console.log(job)
                // console.log(job.id)
                let jobSpawn = Game.getObjectById(job.spawn)
                // console.log(jobSpawn.name, jobSpawn.spawning)
                //
                if (jobSpawn.memory.currentJob !== undefined ) {
                    let jobId = jobSpawn.memory.currentJob
                    let job = Memory.jobs.contracts[CONTRACTS.SPAWN][jobId]
                    // console.log(job)
                    if (job === undefined) {
                        jobSpawn.memory.currentJob = undefined
                    } else { break }
                }

                let energy = jobSpawn.room.energyAvailable
                if (energy < 300) { break }
                if (jobSpawn.room.controller.level > CONSTANTS.STARTER_LEVEL) {
                    console.log('❗️❗️jobAllocator.checkSpawn: TODO: TIME TO FIX THIS ')
                }


                if (jobSpawn.spawning === null) {
                    // console.log('jobAllocator.spawnsRelated: can spawn')
                    let spec = utility.balanceSpec(CONSTANTS.CREEPS_SPECS.WORKER, energy)
                    console.log('jobAllocator.spawnsRelated: bodySpec ' + spec)
                    job.bodySpec = spec
                    jobScheduler.assignedJob(job)
                    // if (jobSpawn.memory.currentJob === undefined) { jobSpawn.memory.currentJob = job.id }
                    // else { jobSpawn.memory.currentJob = job.id }
                } // else { continue }
            }
            // }
            // if (spawn.room.controller.level < CONSTANTS.STARTER_LEVEL) {
            //     starterActions()
            // } else {
            //     starterActions()
            //     console.log('❗️❗️jobAllocator.checkSpawn: TODO THIS')
            // }
        }

        // checkSpawn: function(spawn) {
        //     console.log(spawn)
        //     let spawnContracts = Memory.jobs.contracts[CONTRACTS.SPAWN]
        //     let renewContracts = Memory.jobs.contracts[CONTRACTS.RENEW]
        //     let recycleContracts = Memory.jobs.contracts[CONTRACTS.RECYCLE]
        //
        //     console.log('spawn:', spawnContracts, 'renew:', renewContracts, 'recycle', recycleContracts)
        //
        //     function starterActions() {
        //
        //     }
        //     if (spawn.room.controller.level < CONSTANTS.STARTER_LEVEL) {
        //         starterActions()
        //     } else {
        //         starterActions()
        //         console.log('❗️❗️jobAllocator.checkSpawn: TODO THIS')
        //     }
        //
        // }

    },

}

module.exports = jobAllocator


// var job
