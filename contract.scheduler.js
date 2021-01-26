var utility = require('utility');


var contractScheduler = {

    run: function() {
        let currentTick = Game.time
        console.log(' ')
        console.log('secheduler')

        // console.log(CONTRACT.BUILD)

        searchJobsUtility.runAll()
    },
    // do storage and arrage the contracts

    searchJobs: searchJobsUtility
}

module.exports = contractScheduler

let CONTRACT = {
    // get resource
    HARVEST: 0,
    HARVEST_SMART: 1, // harvest and drop to container
    WITHDRAW: 5,
    // PICKUP: 8,
    // put resource
    BUILD: 10,
    UPGRADE_RC: 11,
    TRANSFER: 12,
    // DISMANTLE: 15,

    ATTACK: 21,
    HEAL: 22,
    REPAIR: 23,
    // transport
    MOVE: 40,
    // PULLER: 41,
    // PULLED: 42,
    // other
    // CLAIM: 50,
    // RESERVE_RC: 51,

    SPAWN: 100,
    // RECYCLE: 110,
    RENEW: 120,
}

var searchJobsUtility = {
    runAll: function() {
        utility.runForAllRooms(searchJobsUtility.energyRelated)
    },

    // energyTargets: function(room) {
    //     function setupMemory(time, value) {
    //         room.memory.energyTargets.time = time
    //         room.memory.energyTargets.value = value
    //     }
    //     if (room.memory.energyTargets === undefined) {
    //         room.memory.energyTargets = {}
    //         setupMemory(0, [])
    //     }
    //     // console.log(room.memory.energyTargets.time + ' test ')
    //     if ((room.memory.energyTargets.time + 10) > Game.time) { // TODO: timeout
    //         // console.log('here')
    //         return room.memory.energyTargets.value
    //     } else {
    //         var targets = []
    //         if (room.controller.owner.username == Memory.myUsername) {
    //             targets = room.find(FIND_STRUCTURES, { filter: structureFilter.hasFreeEnergyCapacity })
    //             setupMemory(Game.time, targets)
    //             console.log('utility.searchJobsUtility.energyTargets: searched ' + room.name + ' and found ' + targets.length + ' targets')
    //             // console.log(targets)
    //         } else { // I don't own this room (so, I'm attacking? stealing?)
    //             targets = room.find(FIND_STRUCTURES, { filter: (structure) => { return
    //                 (structureFilter.hasFreeEnergyCapacity(structure)) &&
    //                 (structureFilter.ownerIsMe(structure))
    //             }})
    //             setupMemory(Game.time, targets)
    //             console.log('utility.searchJobsUtility.energyTargets: search foreign ' + room.name + ' and found ' + targets.length + ' targets')
    //         }
    //         return room.memory.energyTargets.value
    //     }
    // },

    // constructionTargets: function(room) {
    //     function setupMemory(time, value) {
    //         room.memory.constructionTargets.time = time
    //         room.memory.constructionTargets.value = value
    //     }
    //     if (room.memory.constructionTargets === undefined) {
    //         room.memory.constructionTargets = {}
    //         setupMemory(0, [])
    //     }
    //
    //     if (room.memory.constructionTargets.time + 10 > Game.time) { // TODO: timeout
    //         return room.memory.constructionTargets.value
    //     } else {
    //         // var target
    //
    //
    //     }
    //
    // },

    energyRelated: function(room) {
        // get: harvest, withdraw
        // put: build, upgrade, transfer

        console.log('searchJobsUtility.energyRelated: in room ' + room.name)
        // console.log(room.controller.owner.username)
        // console.log(searchJobsUtility.energyTargets(room).length)

        // room.find(FIND_STRUCTURES)
        console.log(room.find(FIND_MY_STRUCTURES).length) // this does not include container
        console.log(room.find(FIND_MY_CONSTRUCTION_SITES).length)

    }

}

var structureFinder = {

}

// var structureFilter = {
//     hasFreeEnergyCapacity: function(structure) {
//         if (structure.store === undefined) { return false }
//         else { return (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) }
//      },
//
//     // ownerIsMe: function(structure) { return structure.owner == Memory.myUsername }
// }



class Contract {

    /**
     * constructor - description
     *
     * @param  {number} kind of contract
     * @param  {number} deadline of game tick time that the task need to finish before
     * @return {Contract}      description
     */
    constructor(kind, deadline) {
        /**
         * test documentation
         * @type {number}
         */
        this.createdTime = Game.time


        /**
         * Time this task should be completed
         * @type {number}
         */
        this.deadline = Game.time


        /**
         * Kind
         * @type {number}
         */
        this.contractKind = kind

    }
}
