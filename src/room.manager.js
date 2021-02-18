var CONSTANT = require('constant')
var utility = require('utility')

var roomManager = {

    manage: function() {
        utility.runForAllRooms(roomManager.checkSpawnInRoom)
        utility.runForAllRooms(roomManager.postSpawnJointQueueInRoom)
        // utility.runForAllRooms(roomManager.roomJointSpawnQueueValidate)
        // utility.runForAllSpawns(roomManager.check)
    },

    checkSpawnInRoom: function(room) {
        console.log('roomManager.checkSpawnInRoom: called ' + room.name)
        if (!room.controller.my) {
            console.log('roomManager.checkSpawnInRoom: ❌ HAVE NOT YET IMPLEMENTED')
            return
        }
        let energyAvailable = room.energyAvailable
        let energyCapacity = room.energyCapacityAvailable
        let sources = room.find(FIND_SOURCES)
        let minerals = room.find(FIND_MINERALS)
        let creeps = room.find(FIND_MY_CREEPS)
        let constructions = room.find(FIND_MY_CONSTRUCTION_SITES)
        // let sourcesCount = Object.keys(room.memory.sources).length
        // console.log('sources: ' + sourcesCount)

        function starter() {
            room.memory.creepRoleTarget.HARVESTER = sources.length + 1
            room.memory.creepRoleTarget.UPGRADER = 1
            room.memory.creepRoleTarget.BUILDER = 1
        }

        function developing() {
            var harvester_s_count = 0
            for (let hash in room.memory.sources) {
                // let source = Game.getObjectById(roo)
                if (room.memory.sources[hash].nearbyContainers.length > 0 ||
                    room.memory.sources[hash].nearbyLinks.length > 0) {
                    harvester_s_count++
                }
            }
            // console.log('smart = ' + harvester_s_count)
            room.memory.creepRoleTarget.HARVESTER_S = harvester_s_count
            room.memory.creepRoleTarget.HARVESTER = Math.max(0, sources.length - harvester_s_count)
            room.memory.creepRoleTarget.UPGRADER = 1
            room.memory.creepRoleTarget.BUILDER = 1
            room.memory.creepRoleTarget.QUEEN = 1
        }

        function developed() {
            developing()
            console.log('roomManager.checkSpawnInRoom: in ' + room.name + ' HAVE NOT IMPLEMENTED THIS')
        }

        switch (room.controller.level) {
            case 1:
            case 2: { starter(); break }
            case 3:
            case 4:
            case 5:
            case 6:
            case 7: { developing(); break }
            case 7: { developed(); break }
        }
    },

    postSpawnJointQueueInRoom: function(room) {
        console.log('roomManager.postSpawnJointQueueInRoom: called on ' + room.name)
        // console.log(room.memory.creepSpawnJointQueue)

        // var queue = []
        var count = {}
        for (let role in room.memory.creepRoleTarget) {
            // console.log(room.memory.creepRoleTarget[role])
            // for (var i = 0; i < room.memory.creepRoleTarget[role]; i++){
            //     queue.push(role)
            // }
            count[role] = room.memory.creepRoleTarget[role]
        }
        // console.log(queue)

        for (let i in room.memory.creepSpawnJointQueue) {
            count[room.memory.creepSpawnJointQueue[i]]--
        }

        for (let creep in room.memory.creepDesignated) {
            // if (room.memory.creepDesignated[creep])
            // queue = utility.arrayDeleteOne(queue, room.memory.creepDesignated[creep].role)
            count[room.memory.creepDesignated[creep].role]--
        }

        // console.log(JSON.stringify(count))
        for (let role in count) {
            for (var i = 0; i < count[role]; i++) {
                // queue.push(role)
                room.memory.creepSpawnJointQueue.push(role)
            }
        }

    },

    roomJointSpawnQueueValidate: function(room) {
        console.log('roomManager.roomJointSpawnQueueValidate: called on ' + room.name)

    },


    memoryAuditCheck: function() {
        console.log('roomManager.memoryAuditCheck: called ')
        utility.runForAllRooms(roomManager.roomJointSpawnQueueValidate)
    },

    memoryCheck: function() {
        // if (Memory.memorySetup.roomManager & (!force)) { return }
        utility.runForAllRooms(roomManager.memoryCheckForRoom)
        // Memory.memorySetup.roomManager = Game.time
    },

    memoryCheckForRoom: function(room) {
        roomManager.computeSourcePropertyInRoom(room)
        roomManager.computeSpawnPathPropertyInRoom(room)
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
        let nearbyContainers = utility.lookAroundPosFor(controller.pos, STRUCTURE_CONTAINER, 3).nearbyStructures
        let nearbyLinks = utility.lookAroundPosFor(controller.pos, STRUCTURE_LINK, 3).nearbyStructures

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

        let lookedLink = utility.lookAroundPosFor(storage.pos, STRUCTURE_LINK, 3).nearbyStructures
        let lookedSpawn = utility.lookAroundPosFor(storage.pos, STRUCTURE_SPAWN, 3).nearbyStructures
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

    computeSpawnPathPropertyInRoom: function(room) {
        let sources = room.find(FIND_SOURCES);
        let minerals = room.find(FIND_MINERALS)
        let controller = room.controller
        let spawns = room.find(FIND_MY_SPAWNS)

        function search(spawn, targets, type) {
            for (let j in targets) {
                let target = targets[j]
                let goal = { pos: target.pos, range: 1}
                let ret = PathFinder.search( spawn.pos, goal, {
                    plainCost: 2,
                    swampCost: 10,
                    maxRooms: 1,
                    roomCallback: function(roomName) {
                        let room = Game.rooms[roomName];
                        if (!room) return;
                        let costs = new PathFinder.CostMatrix;

                        room.find(FIND_STRUCTURES).forEach(function(struct) {
                            if (struct.structureType === STRUCTURE_ROAD) {
                                costs.set(struct.pos.x, struct.pos.y, 1); // Favor roads over plain tiles
                            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                                      (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) {
                                costs.set(struct.pos.x, struct.pos.y, 0xff); // Can't walk through non-walkable buildings
                            }
                        });
                        return costs;
                    },
                });

                if (ret.incomplete) { console.log('rM.cSourceSpawnPIR: path incomplete in room: ' + room.name + ', target: ' + target.id + ', spawn: ' + spawn) }
                if (spawn.memory.pathTo[target.id] === undefined) { spawn.memory.pathTo[target.id] = {} }
                spawn.memory.pathTo[target.id].pathLen = ret.path.length
                spawn.memory.pathTo[target.id].cost = ret.cost
                spawn.memory.pathTo[target.id].type = type
            }
        }


        for (let i in spawns) {
            // console.log(spawns[i])
            let spawn = spawns[i]
            search(spawn, sources, 'source')
            search(spawn, minerals, 'mineral')
            search(spawn, [controller], 'controller')
        }

    },

    computeSourcePropertyInRoom: function(room) {
        console.log('computeSourcePropertyInRoom: 🧮 called on room ' + room.name)
        let sources = room.find(FIND_SOURCES)

        function linkSourceMemory(room, source, links, access) {
            // console.log('linkSourceMemory:', links)
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
            let nearbyContainers = resultContainer.nearbyStructures
            // console.log(source + ' at ' + source.pos, spaceCounter, 'and', nearbyContainers)
            if (room.memory.sources[source.id] === undefined) { room.memory.sources[source.id] = {} }
            room.memory.sources[source.id].spaceCounter = spaceCounter
            room.memory.sources[source.id].nearbyContainers = nearbyContainers
            if (room.memory.sources[source.id].nearbyLinks === undefined) { room.memory.sources[source.id].nearbyLinks = [] }

            var linkNearbyFound = false
            for (let index in nearbyContainers) {
                let containerId = nearbyContainers[index]
                let container = Game.getObjectById(containerId)
                if (room.memory.containers[container.id] === undefined) { room.memory.containers[container.id] = {} }
                if (room.memory.containers[container.id].nearbyInterest === undefined) { room.memory.containers[container.id].nearbyInterest = {} }
                room.memory.containers[container.id].nearbyInterest[source.id] = {}
                if (Memory.DEBUG) { room.memory.containers[container.id].nearbyInterest[source.id].type = 'source' }
                let resultLink = utility.lookAroundPosFor(container.pos, STRUCTURE_LINK)

                roomManager.structureLinksNearbyMemoryPairing(room, resultLink.nearbyStructures, container, source)
                if (!linkNearbyFound) { linkNearbyFound = (resultLink.nearbyStructures.length > 0) }
                linkSourceMemory(room, source, resultLink.nearbyStructures, container)
            }
            // console.log('linkNearbyFound =', linkNearbyFound )
            if(!linkNearbyFound){
                let resultRoad = utility.lookAroundPosFor(source.pos, STRUCTURE_ROAD).nearbyStructures
                for (let index in resultRoad) {
                    let roadId = resultRoad[index]
                    let road = Game.getObjectById(roadId)
                    let resultLink = utility.lookAroundPosFor(road.pos, STRUCTURE_LINK)
                    if (room.memory.roads[road.id] === undefined) { room.memory.roads[road.id] = {} }

                    roomManager.structureLinksNearbyMemoryPairing(room, resultLink.nearbyStructures, road, source)
                    linkSourceMemory(room, source, resultLink.nearbyStructures, road)
                }
            }
        }
    },
}
module.exports = roomManager
