var utility = require('utility');


var contractScheduler = {

    run: function() {
        let currentTick = Game.time
        // console.log(' ')
        console.log('contractScheduler: called')

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
    HARVEST_PURE: 1, // harvest and drop immediately to container
    WITHDRAW: 4,
    // PICKUP: 6,
    // DISMANTLE: 8,
    // put resource
    BUILD: 10,
    UPGRADE_RC: 11,
    TRANSFER: 12,
    DROP: 13, // Drop on top of ground or container

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
        utility.runForAllRooms(searchJobsUtility.energyRelated.run)
    },

    energyRelated:  {
        run: function(room) {
            // get: harvest, withdraw
            // put: build, upgrade, transfer

            console.log('searchJobsUtility.energyRelated: in room ' + room.name)
            // console.log(room.controller.owner.username)
            // console.log(searchJobsUtility.energyTargets(room).length)

            // room.find(FIND_STRUCTURES)
            console.log(room.find(FIND_MY_STRUCTURES).length) // this does not include container
            console.log(room.find(FIND_MY_CONSTRUCTION_SITES).length)
            console.log(room.find(FIND_SOURCES).length)
        },

        findContainers: function(room) {
            return room.find(FIND_STRUCTURES, { filter: (structure) => { return
                (structure.structureType == STRUCTURE_CONTAINER)
            }})
        }
    },



}




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
