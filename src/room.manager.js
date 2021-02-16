var CONSTANT = require('constant')
var utility = require('utility')

var roomManager = {

    manage: function() {
        utility.runForAllRooms(roomManager.checkSpawnInRoom)
    },

    checkSpawnInRoom: function(room) {
        console.log('roomManager.checkSpawnInRoom: called ' + room.name)
        
    },



    memoryCheck: function() {
        // if (Memory.memorySetup.roomManager & (!force)) { return }
        utility.runForAllRooms(roomManager.memoryCheckForRoom)
        // Memory.memorySetup.roomManager = Game.time
    },

    memoryCheckForRoom: function(room) {
        roomManager.computeSourcePropertyInRoom(room)
        roomManager.computeStoragePropertyInRoom(room)

    },


    computeStoragePropertyInRoom: function(room) {
        if (room.controller.level < 4) { return } // don't bother
        console.log('computeStoragePropertyInRoom: 🧮 called on room ' + room.name)

        let resultStorage = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE }} )
        // console.log(resultStorage)
        if (resultStorage.length == 0) { return }
        else if (resultStorage.length > 1) { console.log('computeStoragePropertyInRoom: WTF!!!!! 🧮🧮🧮🧮🧮🧮') }
        let storage = resultStorage[0]
        // console.log(storage)

        let lookedLink = utility.lookAroundPosFor(storage.pos, STRUCTURE_LINK, 3).structuresNearby
        let lookedSpawn = utility.lookAroundPosFor(storage.pos, STRUCTURE_SPAWN, 3).structuresNearby
        // for (let i in lookedLink) {
        //     let link = Game.getObjectById(lookedLink[i])
        //     console.log(link)
        // }
        // console.log('storage ', lookedLink.length, lookedLink, lookedSpawn)

        if (lookedSpawn.length > 0) { // BASECAMP SITE
            roomManager.structureLinksNearbyMemoryPairing(lookedLink, storage, CONSTANT.SITE_KIND.BASECAMP)
            // lookedSpawn.map { spawn => roomManager.structureLinksNearbyMemoryPairing(lookedLink, spawn, CONSTANT.SITE_KIND.BASECAMP) }
            for (let index in lookedSpawn) {
                let hash = lookedSpawn[index]
                let spawn = Game.getObjectById(hash)
                // console.log(spawn)
                spawn.memory.storage = storage.id
                spawn.memory.siteKind = CONSTANT.SITE_KIND.BASECAMP
                spawn.memory.linksNearby = lookedLink
            }
        } else if (lookedLink.length > 0) { // STORAGE SITE
            roomManager.structureLinksNearbyMemoryPairing(lookedLink, storage, CONSTANT.SITE_KIND.STORAGE)
        }


    },

    structureLinksNearbyMemoryPairing: function(links, otherStructure, siteKind) {
        // console.log('roomManager.structureLinksNearbyMemoryPairing: ', links, otherStructure, siteKind)
        let room = otherStructure.room
        let key = otherStructure.structureType + 's'
        if (room.memory[key][otherStructure.id] === undefined) { room.memory[key][otherStructure.id] = {} }
        room.memory[key][otherStructure.id].linksNearby = links
        if (room.memory[key][otherStructure.id].siteKind === undefined) {
            room.memory[key][otherStructure.id].siteKind = siteKind
        } else if (room.memory[key][otherStructure.id].siteKind != siteKind) {
            console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + otherStructure)
        }

        // console.log('pairing links:', links)
        for (let index in links) {
            let link = Game.getObjectById(links[index])
            // console.log('this is', link, index, links[index])
            if (room.memory.links[link.id] === undefined) { room.memory.links[link.id] = {} }
            if (room.memory.links[link.id].siteKind === undefined) {
                room.memory.links[link.id].siteKind = siteKind
            } else if (room.memory.links[link.id].siteKind != siteKind) {
                console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + link)
            }
        }

    },

    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        function linkSourceMemory(room, source, links, access) {
            // console.log('linkSourceMemory:', links)
            if (room.memory.sources[source.id].linksNearby === undefined) { room.memory.sources[source.id].linksNearby = {} }
            for (let index in links) {
                let linkHash = links[index]
                // console.log('hash', linkHash)
                if (room.memory.sources[source.id].linksNearby[linkHash] === undefined) { room.memory.sources[source.id].linksNearby[linkHash] = {}}
                room.memory.sources[source.id].linksNearby[linkHash][access.id] = access.structureType
                //FIXME: the above doesn't seem quite efficient
            }
        }

        for (name in sources) {
            let source = sources[name]
            let resultContainer= utility.lookAroundPosFor(source.pos, STRUCTURE_CONTAINER)
            let spaceCounter = resultContainer.freeSpaceCount
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

                roomManager.structureLinksNearbyMemoryPairing(resultLink.structuresNearby, container, CONSTANT.SITE_KIND.RESOURCE_ENERGY)
                if (!linkNearbyFound) { linkNearbyFound = (resultLink.structuresNearby.length > 0) }
                linkSourceMemory(room, source, resultLink.structuresNearby, container)
            }
            // console.log('linkNearbyFound =', linkNearbyFound )
            if(!linkNearbyFound){
                let resultRoad = utility.lookAroundPosFor(source.pos, STRUCTURE_ROAD).structuresNearby
                for (let index in resultRoad) {
                    let roadId = resultRoad[index]
                    let road = Game.getObjectById(roadId)
                    let resultLink = utility.lookAroundPosFor(road.pos, STRUCTURE_LINK)
                    if (room.memory.roads[road.id] === undefined) { room.memory.roads[road.id] = {} }

                    roomManager.structureLinksNearbyMemoryPairing(resultLink.structuresNearby, road, CONSTANT.SITE_KIND.RESOURCE_ENERGY)
                    linkSourceMemory(room, source, resultLink.structuresNearby, road)
                }
            }
        }
    },
}
module.exports = roomManager
