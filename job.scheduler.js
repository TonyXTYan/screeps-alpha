var utility = require('utility');


var jobScheduler = {

    run: function() {
        let currentTick = Game.time
        // console.log(' ')
        console.log('contractScheduler: called')

        console.log(JOBS.BUILD == JOBS.BUILD)
        console.log(JOBS.BUILD == JOBS.ATTACK)

        searchJobsUtility.runAll()
    },
    // do storage and arrage the contracts

    searchJobs: searchJobsUtility
}

module.exports = jobScheduler

let JOBS = {
    // GET RESOURCES
    // harvest energy from source or minerals from deposits.
    HARVEST:        { id: 0, parts: [WORK] },
    // // harvest and drop immediately to container
    HARVEST_PURE:   { id: 1, parts: [WORK] },
    WITHDRAW:       { id: 4, parts: [] },
    PICKUP:         { id: 6, parts: [CARRY] }, //
    DISMANTLE:      { id: 8, parts: [WORK] }, //

    // PUT RESOURCES
    BUILD:          { id: 10, parts: [WORK, CARRY] },
    UPGRADE_RC:     { id: 12, parts: [WORK, CARRY] },
    TRANSFER:       { id: 14, parts: [CARRY] },
    DROP:           { id: 16, parts: [CARRY] }, // Drop on top of ground or container

    // CREEP OR TOWER ish
    ATTACK:         { id: 20, parts: [ATTACK] },
    // ATTACK_RANGED:  { }
    ATTACK_MASS:    { id: 21, parts: [RANGED_ATTACK] },
    HEAL:           { id: 24, parts: [HEAL] }, // heal creeps
    REPAIR:         { id: 26, parts: [WORK, CARRY] }, // repair structure

    // TRANSPORT
    MOVE:           { id: 30, parts: [MOVE] },
    // PULLER: {id: , parts: []}, // TODO: check this
    // PULLED: {id: , parts: []},

    // OTHER
    CLAIM:          { id: 80, parts: [CLAIM] },
    RESERVE_RC:     { id: 84, parts: [CLAIM] },

    // SPAWN ACTION
    SPAWN:          { id: 100 },
    RECYCLE:        { id: 110 },
    RENEW:          { id: 120 },

    // ROOM CONTROLLER
    SAFE_MODE:      { id: 200 },
    UNCLAIM:        { id: 201 }
}

var searchJobsUtility = {
    runAll: function() {
        utility.runForAllRooms(searchJobsUtility.energyRelated.run)
        // searchJobsUtility.searchEnergyRelated.run()
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

        // findContainers: function(room) {
        //     return room.find(FIND_STRUCTURES, { filter: (structure) => { return
        //         (structure.structureType == STRUCTURE_CONTAINER)
        //     }})
        // }
    },

    // searchEnergyRelated: {
    //     run: function() {
    //         console.log(Object.keys(Game.structures).length)
    //     }
    // }

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

        this.invalidTime = 0


        /**
         * Kind
         * @type {number}
         */
        this.contractKind = kind
    }
}
