// var contractAgent = require('contract.agent');
var utility = require('utility');
var CONSTANTS = require('constants');
var jobUtility = require('job.utility');
var jobScheduler = require('job.scheduler');
var jobContract = require('job.contract');


var spawnController = {

    run: function() {
        // console.log('spawnController.run: called')

        // if (Game.time % CONSTANTS.FREQ_HIGH == 0) {
            utility.runForAllSpawns(spawnController.checkSpawnning)
        // }
    },

    checkSpawnning: function(spawn) {
        // console.log('spawnController.checkSpawnning: on ' + spawn.name)
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

        // console.log("spawnController.checkSpawnning: called on " + spawn.name + ' in room ' + spawn.room.name + ', Mem: ' + spawn.memory.currentJob)

        // console.log("Spawn hits: " + spawn.hits + ' of ' + spawn.hitsMax)
        // console.log("Spawn energy: " + spawn.store.getUsedCapacity(RESOURCE_ENERGY) + ' of ' + spawn.store.getCapacity(RESOURCE_ENERGY))

        // console.log(spawn.memory.contracted)
        // if(spawn.memory.contracted === undefined) { spawn.memory.contracted = false }
        // if(spawn.memory.contract === undefined) { spawn.memory.contract = null }

        // console.log('Spawn ' + spawn.name + ' exited')

        // utility.computeSourcePropertyInRoom(spawn.room)
        // if (spawn.memory.spawnedThisTick === undefined) { spawn.memory.spawnn}
        // spawn.memory.spawnnedThisTick = 0
        if (spawn.memory.currentJob === undefined && spawn.store.getFreeCapacity() == 0) {
            console.log('spawnController.checkSpawnning: ' + spawn.name + ' does not have a .currentJob')
            // console.log('')
            return
        }

        if (spawn.memory.currentJob === undefined) { return }

        // console.log(spawn.store.getFreeCapacity(RESOURCE_ENERGY), ' free ')

        // let jobId = spawn.memory.currentJob
        // console.log(utility.getJobFromId(jobId))
        // Sanity Checks
        let job = jobUtility.getJobFromId(spawn.memory.currentJob)
        function removeFromMemory() {
            console.log('spawnController.checkSpawnning: remove job ' + spawn.memory.currentJob)
            // if (spawn.memory.currentJob) {
            let array = spawn.memory.jobsLinked
            let replacement = utility.general.arrayDeleteOne(array, spawn.memory.currentJob)
            spawn.memory.jobsLinked = replacement
            // }
            spawn.memory.currentJob = undefined
        }
        if (job === undefined) {
            console.log('❗️❗️spawnController.checkSpawnning: encountered undefined job');
            removeFromMemory()
            return
        }
        if (job.bodySpec === undefined) {
            console.log('❗️❗️spawnController.checkSpawnning: encountered undefined job.bodySpec')
            // spawn.memory.currentJob = undefined
            removeFromMemory()
            return
        }
        // console.log(job.id)
        let bodySpec = job.bodySpec
        let name = Game.time + '_' + Memory.spawns.spawnnedThisTick
        // console.log(name)
        let argSpec = utility.balanceSpec(bodySpec, Math.min(spawn.room.energyAvailable, 2000))

        let code = spawn.spawnCreep(argSpec, name)

        if (code == OK) {
            jobContract.completedJob(job)
        } else {
            console.log('spawnController.checkSpawnning: ❗️ spec ' + bodySpec, ', name: ' + name +', returned: ' + code)
        }
        // jobScheduler.completedJob(job)


    }

    // spawn
    // renew
    // recycle




}

module.exports = spawnController
