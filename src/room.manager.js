var CONSTANT = require('constant')
var utility = require('utility')

var roomManager = {

    run: function() {
        roomManager.memoryCheck()
    },

    checkSpawn: function() {

    },

    memoryCheck: function() {
        // if (Memory.memorySetup.roomManager & (!force)) { return }
        utility.runForAllRooms(roomManager.memoryCheckForRoom)
        // Memory.memorySetup.roomManager = Game.time
    },

    memoryCheckForRoom: function(room) {
        // console.log('utility.memoryCheckForRoom: called on ' + room.name)
        // if ((room.memory.sourcesChecked === undefined) ||
            // (room.memory.sourcesChecked + CONSTANT.FREQ_LOW < Game.time)) { //FIXME: schedule
            // console.log('roomManager.memoryCheckForRoom: here')
        roomManager.computeSourcePropertyInRoom(room)
        // }

    },

    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        // if (room.memory.sources === undefined) { room.memory.sources = {} }
        // if (room.memory.containers === undefined) { room.memory.containers = {} }

        for (name in sources) {
            let source = sources[name]
            let resultContainer= utility.lookAroundPosFor(source.pos, STRUCTURE_CONTAINER)
            let spaceCounter = resultContainer.spaceCounter
            let containersNearby = resultContainer.structuresNearby
            // console.log(source + ' at ' + source.pos, spaceCounter, 'and', containersNearby)
            if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
            room.memory.sources[source.id].spaceCounter = spaceCounter
            room.memory.sources[source.id].containersNearby = containersNearby

            var linkNearbyFound = false
            for (let index in containersNearby) {
                let containerId = containersNearby[index]
                let container = Game.getObjectById(containerId)
                let resultLink = utility.lookAroundPosFor(container.pos, STRUCTURE_LINK)
                if (room.memory.containers[container.id] === undefined) { room.memory.containers[container.id] = {} }
                room.memory.containers[container.id].linksNearby = resultLink.structuresNearby
                if (room.memory.containers[container.id].siteKind === undefined) {
                    room.memory.containers[container.id].siteKind = CONSTANT.SITE_KIND.RESOURCE_ENERGY
                } else if (room.memory.containers[container.id].siteKind != CONSTANT.SITE_KIND.RESOURCE_ENERGY){
                    console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + container)
                }
                if (!linkNearbyFound) { linkNearbyFound = (resultLink.length > 0) }
            }

            // console.log(linkNearbyFound)
            if(!linkNearbyFound){
                let resultRoad = utility.lookAroundPosFor(source.pos, STRUCTURE_ROAD).structuresNearby
                for (let index in resultRoad) {
                    let roadId = resultRoad[index]
                    let road = Game.getObjectById(roadId)
                    let resultLink = utility.lookAroundPosFor(road.pos, STRUCTURE_LINK)
                    if (room.memory.roads[road.id] === undefined) { room.memory.roads[road.id] = {} }
                    room.memory.roads[road.id].linksNearby = resultLink.structuresNearby
                    if (room.memory.roads[road.id].siteKind === undefined) {
                        room.memory.roads[road.id].siteKind = CONSTANT.SITE_KIND.RESOURCE_ENERGY
                    } else if (room.memory.roads[road.id].siteKind != CONSTANT.SITE_KIND.RESOURCE_ENERGY) {
                        console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + road)
                    }
                }

            }

        }
        // room.memory.sourcesChecked = Game.time
    },
}
module.exports = roomManager
