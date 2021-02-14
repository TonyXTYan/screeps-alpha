var CONSTANTS = require('constants');
var utility = require('utility');
// var jobUtility = require('job.utility');
// var jobContract = require('job.contract');

var jobUtility = {

    /**
     * mapJobsType - Mapping function across all this job type
     *
     * @param {number} type type of job as defined above in CONTRACTS
     * @param {function} func function to be mapped
     */
    mapJobsType: function(type, func, secondParam) {
        // console.log('jobUtility.mapJobsType:', type, ' is called ')
        for (let id in Memory.jobs.contracts[type]){
            if (Memory.jobs.contracts[type][id] === undefined) { console.log('jobUtility.mapJobsType: 📛 memory miss-synced on ' + id); continue }
            func(Memory.jobs.contracts[type][id], secondParam)
        }
    },


    /**
     * mapAllJobs - Map this function across all jobs
     *
     * @param  {function} func function to be mapped
     */
    mapAllJobs: function(func, secondParam) {
        for(let type in Memory.jobs.contracts) {
            jobUtility.mapJobsType(type, func, secondParam)
        }
    },


    /**
     * jobCount - Count the number of jobs cached in Memory
     *
     * @return {number}  the number of jobs
     */
    jobCount: function() {
        var output = new Object()
        if (Memory.jobs === undefined) { return output }
        output.all = 0
        for(let type in Memory.jobs.contracts) {
            output[type] = Object.keys(Memory.jobs.contracts[type]).length
            output.all += output[type]
        }
        return output
    },


    /**
     * getJobFromId - Get the job Object for given job ID.
     *
     * @param  {string} id The ID of this job
     * @return {Object}    The Contract Object
     */
    getJobFromId: function(id) {
        if (!id) {
            console.log('jobUtility.getJobFromId: ❗️ ' + id);
            return undefined
        }
        let typeId = id.split('_')[0]
        // console.log(typeId)
        // let job = Memory.jobs.contracts[typeId][id]
        // console.log(job)
        let job = Memory.jobs.contracts[typeId][id]
        if (job === undefined) { console.log('jobUtility.getJobFromId: ❗️ id=' + id, ' is undefined in memory') }
        return job
    },

    // FIXME:
    // bestBodyParts: function(jobId, energy) {
    //     // let CONTRACTS = jobUtility.CONTRACTS
    //
    //     let CONTRACT = jobContract.CONTRACT
    //     switch(jobId) {
    //         case CONTRACT.HARVEST.id: {
    //             return utility.balanceSpec(CONSTANTS.CREEPS_SPECS.WORKER, energy)
    //         }
    //     }
    // },




}

module.exports = jobUtility
