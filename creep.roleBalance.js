// var creepPopulationControl = require('creep.populationControl');
var roleHarvester = require('role.harvester');

var creepRoleBalance = {


    /**
     * trySpawn - Try spawn something
     *
     * @param  {type} spawn description
     * @return {type}       description
     */
    trySpawn: function(spawn) {
        if (spawn.memory.full === undefined) { spawn.memory.full = -1 }

        var result = creepRoleBalance.countEnergy(spawn)

        var totalEnergyAvailable = result.available
        var totalEnergyCapacity = result.capacity

        if (totalEnergyAvailable == totalEnergyCapacity) {
            if (spawn.memory.full < 0) { spawn.memory.full = Game.time }

            // wait this many ticks before spawn
            const waitTicks = Object.keys(Game.creeps).length * 10 + 50

            if (spawn.memory.full + waitTicks < Game.time) { // ready to spawn new creep
                var body = creepRoleBalance.balanceSpec([1,1,1,0, 0,0,0,0], totalEnergyCapacity)
                let result = spawn.spawnCreep(body, 'Creep'+Game.time)
                console.log('creep.roleBalane: Spawn was ' + result)
                spawn.memory.full = -1
            } else {
                console.log('creep.roleBalane: 👍🏻Ready to spawn a new Creep in ' + (spawn.memory.full + waitTicks - Game.time) + ' ticks')
            }
        } else {
            console.log('creep.roleBalane: Have energy of ' + totalEnergyAvailable + ' out of ' + totalEnergyCapacity)
            spawn.memory.full = -1
        }
    },

    specification: {
        // ratio of the body parts desired in a new spawn
        // [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        // [50,   100,  50,    80,     150,           250,  600,   10   ]
        "harvester":    [1,1,1,0, 0,0,0,0],
        "builder":      [1,1,1,0, 0,0,0,0],
        "upgrader":     [1,1,1,0, 0,0,0,0],
        "doctor":       [2,1,1,0, 0,1,0,0] // so min energy 500
    },


    /**
     * countEnergy - Count how much energy can this spawn spawn
     * @param  {type} spawn description
     * @return {type}       description
     */
    countEnergy: function(spawn) {
        var extensionStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        })

        var totalEnergyAvailable = spawn.store.getUsedCapacity(RESOURCE_ENERGY)
        var totalEnergyCapacity = 300
        for (var i in extensionStructures) {
            // console.log(extension)
            totalEnergyAvailable += extensionStructures[i].store.getUsedCapacity(RESOURCE_ENERGY)
            totalEnergyCapacity += extensionStructures[i].store.getCapacity(RESOURCE_ENERGY)
        }
        return {'available': totalEnergyAvailable, 'capacity': totalEnergyCapacity}
    },


    /**
     * balanceSpec - Try to balance the specification given with given energy levels
     *
     * @param  {type} spec   description
     * @param  {type} energy description
     * @return {type}        description
     */
    balanceSpec: function(spec, energy) {
        // var sum = spec.reduce((a, b) => a + b, 0)
        const bodyPartName = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]
        const bodyPartCost = [50,   100,  50,    80,     150,           250,  600,   10   ]

        var weighted = []
        var weightedSum = 0
        for (i in spec){
            var c = spec[i] * bodyPartCost[i]
            weighted[i] = c
            weightedSum += c
        }
        var scale = energy / weightedSum

        var parts = []
        for (i in spec) {
            var count = Math.floor(weighted[i] * scale / bodyPartCost[i])
            for (c in Array(count).fill(0)) {
                // console.log(c)
                parts.push(bodyPartName[i])
            }
        }
        return parts
    },


    /**
     * creepsType - Find how many each type of screeps in the room
     *
     * @param  {type} room description
     * @return {type}      description
     */
    creepsType: function(room) {
        var harvester = []
        var builder = []
        var upgrader = []
        var doctor = []
        for (let name in Game.creeps) {
            let creep = Game.creeps[name]
            let role = creep.memory.role
            if (role === undefined) { continue }
            else if (role == 'harvester') { harvester.push(name) }
            else if (role == 'builder') { builder.push(name) }
            else if (role == 'upgrader') { upgrader.push(name) }
            else if (role == 'doctor') { doctor.push(name) }
            else { continue }
        }
        return {'harvester': harvester, 'builder': builder, 'upgrader': upgrader, 'doctor': doctor}
    },


    /**
     * balanceBuilderUpgrader - balance between builder and upgrader population
     *
     * @param  {type} room description
     * @return {type}      description
     */
    balanceBuilderUpgrader: function(room) {
        let types = creepRoleBalance.creepsType(room)
        // var harvester = types.harvester
        var builder = types.builder
        var upgrader = types.upgrader

        var targets = room.find(FIND_CONSTRUCTION_SITES);

        if (builder.length > targets.length && builder.length > 1 || (builder.length > 2 && upgrader.length == 0)) { // too much builder
            console.log('creep.roleBalane: Too much builder (more than one per construction), changing one to upgrader')
            let creep = Game.creeps[builder[0]]
            creep.say('♿️')
            creep.memory.role = 'upgrader'
        } else if (builder.length < targets.length && upgrader.length > 1) { // too much upgrader
            console.log('creep.roleBalane: Too much upgrader (need more builder on constructions), changing one to builder')
            let creep = Game.creeps[upgrader[0]]
            creep.say('♿️')
            creep.memory.role = 'builder'
        } else {
            // we're good
        }
    },


    /**
     * balanceUpgraderHarvester - balance between upgrader and harvester population
     *
     * @param  {type} room description
     * @return {type}      description
     */
    balanceUpgraderHarvester: function(room) {
        let types = creepRoleBalance.creepsType(room)
        var harvester = types.harvester
        // var builder = types.builder
        var upgrader = types.upgrader

        if (harvester.length > 0) {
            // console.log(harvester)
            let creep = Game.creeps[harvester[0]]
            let harvesterTarget = roleHarvester.energyTargets(creep)
            // console.log(harvesterTarget)

            var usedCapacity = 0
            var totalCapacity = 0

            for (let i in harvesterTarget) {
                // console.log(harvesterTarget[i])
                usedCapacity += harvesterTarget[i].store.getUsedCapacity(RESOURCE_ENERGY)
                totalCapacity += harvesterTarget[i].store.getCapacity(RESOURCE_ENERGY)
            }

            let ratio = usedCapacity / totalCapacity

            // let totalCreeps = harvester.length + upgrader.length

            console.log('creep.roleBalane: filled: ' + usedCapacity + ', total: ' + totalCapacity + ', Eratio: ' + ratio)

            if ((ratio < 0.5) &&
                (upgrader.length > 1) &&
                ((upgrader.length / harvester.length) > (ratio * 1.1))
            ) {
                let creep = Game.creeps[upgrader[0]]
                console.log('creep.roleBalane: Too much upgrader (need more harvester), changing ' + creep.name + ' one to harvester')
                creep.say('♿️')
                creep.memory.role = 'harvester'
            } else if (
                (ratio > 0.95) &&
                (harvester.length > 3)
            ) {
                console.log('creep.roleBalane: Too much harvester (need more upgrader), changing ' + creep.name + ' to upgrader')
                let creep = Game.creeps[harvester[0]]
                creep.say('♿️')
                creep.memory.role = 'upgrader'
            }


        } else {
            console.log('creep.roleBalane: creep.roleBalance: thisi is bad')
        }


    }


}


module.exports = creepRoleBalance
