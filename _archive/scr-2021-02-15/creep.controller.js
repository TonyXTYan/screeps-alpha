var utility = require('utility');
var jobUtility = require('job.utility');
var jobContract = require('job.contract');
var CONTRACT = jobContract.CONTRACT

var creepController = {
    run: function() {
        utility.runForAllCreeps(creepController.executeJob.run)
    },

    executeJob: {
        run: function(creep) {
            // console.log('creepController.executeJob.run: called ' + creep.name)
            let jobLinked = creep.memory.jobLinked
            if (!jobLinked) { return }
            // console.log('creepController.executeJob: creep ' + creep.name + ', job: ' + jobLinked)

            let job = jobUtility.getJobFromId(jobLinked)
            if (job === undefined) {
                console.log('creepController.executeJob: jobLinked ' + jobLinked + ' no longer exists, removing it from creep\'s memory!')
                creep.memory.jobLinked = undefined
                return
            }

            switch (job.jobTypeId) {
                case CONTRACT.HARVEST.id: {
                    creepController.executeJob.harvestJob(creep, job)
                    break
                };
                case CONTRACT.BUILD.id: {
                    creepController.executeJob.buildJob(creep, job)
                    break
                };
                case CONTRACT.UPGRADE_RC.id: {
                    creepController.executeJob.upgradeRcJob(creep, job)
                    break
                };
                default: {
                    console.log('creepController.executeJob.run: 📝📝📝 undefined job behaviour ' + job.id )
                };
            }

        },

        harvestJob: function(creep, job) {
            // console.log(jobLinked)
            // let job = jobUtility.getJobFromId(jobLinked)
            // if (job === undefined) {
            //     console.log('creepController.executeJob: jobLinked ' + jobLinked + ' no longer exists, removing it from creep\'s memory!')
            //     creep.memory.jobLinked = undefined
            //     return
            // }
            // console.log(job)
            // console.log(job.id)

            if (creep.store.getFreeCapacity() == 0) {
                // job completed
                jobContract.completedJob(job)
            }

            let target = Game.getObjectById(job.target)
            // console.log(target.id)
            if (!target) {
                console.log('creepController..harvestJob: ❗️❗️❗️' + job.id + ' THIS IS A BIG PROBLEM');
                jobContract.removeJob(job);
                return
            }

            let code = creep.harvest(target)
            if (code == OK) {
                creep.say('🍞')
            } else if (code == ERR_NOT_IN_RANGE) {
                creep.say('🍞🏃')
                creep.moveTo(target, { visualizePathStyle: { stroke: '#3d2a22' } }) // path optimisation
            } else if (code == ERR_NOT_ENOUGH_ENERGY) {
                creep.say('🚱')
                // TODO: job completed
                jobContract.completedJob(job)
            } else if (code == ERR_NO_PATH) {
                creep.say('🚷')
                console.log('creepController.harvestJob: creep ' + creep.name + ' path bloecked ' + job.id)
                jobContract.removeJob(job)
            } else {
                creep.say(code)
                console.log('creepController..harvestJob: ❗️' + job.id + ' failed with code ' + code)
            }
        },

        buildJob: function(creep, job) {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                jobContract.completedJob(job)
            }
            let site = Game.getObjectById(job.site)
            if (!site) {
                console.log('creepController..buildJob: ❗️❗️❗️' + job.id + ' THIS IS A BIG PROBLEM');
                jobContract.removeJob(job);
                return
            }
            let code = creep.build(site)
            if (code == OK) {
                creep.say('🔨')
            } else if (code == ERR_NOT_IN_RANGE) {
                creep.say('🔨🏃')
                creep.moveTo(site, { visualizePathStyle: { stroke: '#3d2a22' } })
            // } else if (code == ERR_NOT_ENOUGH_ENERGY) {
            } else {
                creep.say(code)
                console.log('creepController..buildJob: ❗️' + job.id + ' failed with code ' + code)
            }
        },

        upgradeRcJob: function(creep, job) {
            // console.log('creepController.upgradeRcJob: called on creep ' + creep.name + ' and job ' + job.id)
            // console.log(creep)
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                jobContract.completedJob(job)
            }
            let controller = Game.getObjectById(job.controller)
            // console.log(controller)
            if (!controller) {
                console.log('creepController..upgradeRcJob: ❗️❗️❗️' + job.id + ' THIS IS A BIG PROBLEM')
                jobContract.removeJob(job);
                return
            }

            let code = creep.upgradeController(controller)
            if (code == OK) {
                creep.say('🆙')
            } else if (code == ERR_NOT_IN_RANGE) {
                creep.say('🆙🏃')
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#3d2a22' } })
            // } else if (code == ERR_NOT_ENOUGH_ENERGY) {
            //     creep.say('')
            } else {
                creep.say(code)
                console.log('creepController..upgradeRcJob: ❗️' + job.id + ' failed with code ' + code)
            }

            // console.log('creepController.upgradeRcJob: exited')
        },

    },

}

module.exports = creepController
