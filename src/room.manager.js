var CONSTANT = require('constant')
var utility = require('utility')

var roomManager = {

    manage: function() {
        utility.runForAllRooms(roomManager.checkSpawnInRoom)
    },

    checkSpawnInRoom: function(room) {
        console.log('roomManager.checkSpawnInRoom: called ' + room.name)
        let energyAvailable = room.energyAvailable
        let sources = room.find(FIND_SOURCES)
        let sourcesCount = sources.length
        // console.log(sources.length)

    },



    memoryCheck: function() {
        // if (Memory.memorySetup.roomManager & (!force)) { return }
        utility.runForAllRooms(roomManager.memoryCheckForRoom)
        // Memory.memorySetup.roomManager = Game.time
    },

    memoryCheckForRoom: function(room) {
        roomManager.computeSourcePropertyInRoom(room)
        roomManager.computeStoragePropertyInRoom(room)
        roomManager.computeControllerPropertyInRoom(room)
    },

    computeControllerPropertyInRoom: function(room) {
        console.log('computeControllerPropertyInRoom: 🧮 called on room ' + room.name)
        // let controllers = room.find(FIND_STRUCTURES)
        // console÷
        let controller = room.controller
        // console.log(controller)
        if (!controller) { return }
        let nearbyContainers = utility.lookAroundPosFor(controller.pos, STRUCTURE_CONTAINER, 3).structuresNearby
        let nearbyLinks = utility.lookAroundPosFor(controller.pos, STRUCTURE_LINK, 3).structuresNearby

        room.memory.controller.nearbyContainers = nearbyContainers
        room.memory.controller.nearbyLinks = nearbyLinks

        // console.log(nearbyContainers, 'and', nearbyLinks)

        for (let i in nearbyContainers) {
            let container = Game.getObjectById(nearbyContainers[i])
            // console.log(container)
            if (room.memory.containers[container.id] === undefined) { room.memory.containers[container.id] = {} }
            if (room.memory.containers[container.id].nearbyLinks === undefined) { room.memory.containers[container.id].nearbyLinks = nearbyLinks }
            if (room.memory.containers[container.id].nearbyInterest === undefined ) { room.memory.containers[container.id].nearbyInterest = {} }
            room.memory.containers[container.id].nearbyInterest[controller.id] = {}
            if (Memory.DEBUG) { room.memory.containers[container.id].nearbyInterest[controller.id].type = 'controller'}
        }

        for (let i in nearbyLinks) {
            let link = Game.getObjectById(nearbyLinks[i])
            // console.log(link)
            if (room.memory.links[link.id] === undefined) { room.memory.links[link.id] = {} }
            if (room.memory.links[link.id].nearbyInterest === undefined) {room.memory.links[link.id].nearbyInterest = {} }
            room.memory.links[link.id].nearbyInterest[controller.id] = {}
            if (Memory.DEBUG) { room.memory.links[link.id].nearbyInterest[controller.id].type = 'controller' }

        }

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
            roomManager.structureLinksNearbyMemoryPairing(room, lookedLink, null, storage)
            // lookedSpawn.map { spawn => roomManager.structureLinksNearbyMemoryPairing(lookedLink, spawn, CONSTANT.SITE_KIND.BASECAMP) }
            for (let index in lookedSpawn) {
                let hash = lookedSpawn[index]
                let spawn = Game.getObjectById(hash)
                // console.log(spawn)
                spawn.memory.storage = storage.id
                // spawn.memory.siteKind = CONSTANT.SITE_KIND.BASECAMP
                spawn.memory.nearbyLinks = lookedLink
            }
        } else if (lookedLink.length > 0) { // STORAGE SITE
            roomManager.structureLinksNearbyMemoryPairing(room, lookedLink, null, storage)
        }


    },

    structureLinksNearbyMemoryPairing: function(room, links, access = null, interest = null) { // , siteKind) {
        // console.log('structureLinksNearbyMemoryPairing: room:', room + ', links:', links + ',access:', access + ', interest:', interest)
        // let room = access.room

        if (links.length == 0) { return } // { console.log('nothing') }

        if (access !== null) {
            let akey = access.structureType + 's'
            if (room.memory[akey][access.id] === undefined) { room.memory[akey][access.id] = {} }
            room.memory[akey][access.id].nearbyLinks = links
        }
        if (interest !== null) {
            var ikey = interest.structureType + 's'
            if (room.memory.sources[interest.id] !== undefined) { ikey = 'sources' }
            // console.log(room.memory[ikey], ikey)
            if (room.memory[ikey][interest.id] === undefined) { room.memory[ikey][interest.id] = {} }
            room.memory[ikey][interest.id].nearbyLinks = links
        }

        if (access === null && interest === null) { console.log('roomManager.structureLinksNearbyMemoryPairing: WHAT THE HELL') }

        // if (room.memory[key][access.id].siteKind === undefined) {
        //     room.memory[key][access.id].siteKind = siteKind
        // } else if (room.memory[key][access.id].siteKind != siteKind) {
        //     console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + access)
        // }

        // console.log('pairing links:', links)
        for (let index in links) {
            let link = Game.getObjectById(links[index])
            // console.log('this is', link, index, links[index])
            // console.log(room.memory.links)
            if (room.memory.links[link.id] === undefined) { room.memory.links[link.id] = {} }
            // if (room.memory.links[link.id].siteKind === undefined) {
            //     room.memory.links[link.id].siteKind = siteKind
            // } else if (room.memory.links[link.id].siteKind != siteKind) {
            //     console.log('roomManager.computeSourcePropertyInRoom: ♨️ Memory clashing ' + link)
            // }
            if (room.memory.links[link.id].nearbyAccess === undefined) { room.memory.links[link.id].nearbyAccess = {} }
            if (room.memory.links[link.id].nearbyInterest === undefined) { room.memory.links[link.id].nearbyInterest = {} }
            if (access !== null) {
                room.memory.links[link.id].nearbyAccess[access.id] = {}
                if (Memory.DEBUG) { room.memory.links[link.id].nearbyAccess[access.id].type = access.structureType }
            }
            if (interest !== null) {
                room.memory.links[link.id].nearbyInterest[interest.id] = {}
                if (Memory.DEBUG) {
                    room.memory.links[link.id].nearbyInterest[interest.id].type = interest.structureType
                    if (room.memory.sources[interest.id] !== undefined) {
                        room.memory.links[link.id].nearbyInterest[interest.id].type = 'source'
                    }
                }
            }

        }

    },

    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        function linkSourceMemory(room, source, links, access) {
            // console.log('linkSourceMemory:', links)
            if (room.memory.sources[source.id].nearbyLinks === undefined) { room.memory.sources[source.id].nearbyLinks = {} }
            for (let index in links) {
                let linkHash = links[index]
                // console.log('hash', linkHash)
                if (room.memory.sources[source.id].nearbyLinks[linkHash] === undefined) { room.memory.sources[source.id].nearbyLinks[linkHash] = {}}
                room.memory.sources[source.id].nearbyLinks[linkHash][access.id] = access.structureType
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
                if (room.memory.containers[container.id] === undefined) { room.memory.containers[container.id] = {} }
                if (room.memory.containers[container.id].nearbyInterest === undefined) { room.memory.containers[container.id].nearbyInterest = {} }
                room.memory.containers[container.id].nearbyInterest[source.id] = {}
                if (Memory.DEBUG) { room.memory.containers[container.id].nearbyInterest[source.id].type = 'source' }
                let resultLink = utility.lookAroundPosFor(container.pos, STRUCTURE_LINK)

                roomManager.structureLinksNearbyMemoryPairing(room, resultLink.structuresNearby, container, source)
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

                    roomManager.structureLinksNearbyMemoryPairing(room, resultLink.structuresNearby, road, source)
                    linkSourceMemory(room, source, resultLink.structuresNearby, road)
                }
            }
        }
    },
}
module.exports = roomManager
