var contractScheduler = {
    run: function() {


        console.log('secheduler')



    }
    // do storage and arrage the contracts


}


module.exports = contractScheduler


Object.assign(exports, {
    TASK_HARVEST: 0,
    TASK_WITHDRAW: 1,
    TASK_PICKUP: 2,
    TASK_BUILD: 10,
    TASK_UPGRADE_RC: 11,
    TASK_TRANSFER: 12,
    TASK_ATTACK: 21,
    TASK_HEAL: 22,
    TASK_REPAIR: 23,
    TASK_MOVE: 30,
    TASK_PULL: 41,
    TASK_DISMANTLE: 50,
    TASK_CLAIM: 60,
    TASK_RESERVE_RC: 61,

    TASK_SPAWN: 100,
    TASK_RECYCLE: 110,
    TASK_RENEW: 120,
})
