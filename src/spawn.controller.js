// var contractAgent = require('contract.agent');
var utility = require('utility');
var CONSTANTS = require('constants');
var jobUtility = require('job.utility');
var jobScheduler = require('job.scheduler');
var jobContract = require('job.contract');


var spawnController = {

    run: function() {
        // for(var name in Game.spawns) {
        //     // let spawn = Game.spawns[name]
        //     spawnController.checkSpawnning(Game.spawns[name])
        // }
        if (Game.time % CONSTANTS.FREQ_HIGH == 0) {
            utility.runForAllSpawns(spawnController.checkSpawnning)
        }
    },

    checkSpawnning: function(spawn) {
        // var log = ""
        // console.log(' ')
        // if (spawn.spawning !== null ) { return }
        if(spawn.spawning) {
            // var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawn.spawning.name,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8}
            );
            return
        }
        if (spawn.store[RESOURCE_ENERGY] < 300 ) { return }
        console.log("spawnController.checkSpawnning: called on " + spawn.name + ' in room ' + spawn.room.name)
        // console.log("Spawn hits: " + spawn.hits + ' of ' + spawn.hitsMax)
        // console.log("Spawn energy: " + spawn.store.getUsedCapacity(RESOURCE_ENERGY) + ' of ' + spawn.store.getCapacity(RESOURCE_ENERGY))

        // console.log(spawn.memory.contracted)
        // if(spawn.memory.contracted === undefined) { spawn.memory.contracted = false }
        // if(spawn.memory.contract === undefined) { spawn.memory.contract = null }

        // console.log('Spawn ' + spawn.name + ' exited')

        // utility.computeSourcePropertyInRoom(spawn.room)
        // if (spawn.memory.spawnedThisTick === undefined) { spawn.memory.spawnn}
        // spawn.memory.spawnnedThisTick = 0
        if (spawn.memory.currentJob === undefined) {
            console.log('spawnController.checkSpawnning: ' + spawn.name + ' idling')
            // console.log('')
            return
        }

        // let jobId = spawn.memory.currentJob
        // console.log(utility.getJobFromId(jobId))
        // Sanity Checks
        let job = jobUtility.getJobFromId(spawn.memory.currentJob)
        if (job === undefined) {
            console.log('❗️❗️spawnController.checkSpawnning: encountered undefined job');
            spawn.memory.currentJob = undefined
            return
        }
        if (job.bodySpec === undefined) {
            console.log('❗️❗️spawnController.checkSpawnning: encountered undefined job.bodySpec')
            spawn.memory.currentJob = undefined
            return
        }
        // console.log(job.id)
        let bodySpec = job.bodySpec
        let name = Game.time + '_' + Memory.spawns.spawnnedThisTick
        // console.log(name)

        spawn.spawnCreep(bodySpec, name)
        // jobScheduler.completedJob(job)
        jobContract.completedJob(job)


    }

    // spawn
    // renew
    // recycle




}

module.exports = spawnController
