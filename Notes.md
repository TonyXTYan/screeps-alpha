# Room Control Level

| RCL  | Energy to upgrade | Structures                                                   |
| :--- | :---------------- | :----------------------------------------------------------- |
| 0    | —                 | Roads, 5 Containers                                          |
| 1    | 200               | Roads, 5 Containers, 1 Spawn                                 |
| 2    | 45,000            | Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls |
| 3    | 135,000           | Roads, 5 Containers, 1 Spawn, 10 Extensions (50 capacity), Ramparts (1M max hits), Walls, 1 Tower |
| 4    | 405,000           | Roads, 5 Containers, 1 Spawn, 20 Extensions (50 capacity), Ramparts (3M max hits), Walls, 1 Tower, Storage |
| 5    | 1,215,000         | Roads, 5 Containers, 1 Spawn, 30 Extensions (50 capacity), Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links |
| 6    | 3,645,000         | Roads, 5 Containers, 1 Spawn, 40 Extensions (50 capacity), Ramparts (30M max hits), Walls, 2 Towers, Storage, 3 Links, Extractor, 3 Labs, Terminal |
| 7    | 10,935,000        | Roads, 5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, Storage, 4 Links, Extractor, 6 Labs, Terminal |
| 8    | —                 | Roads, 5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn |




# Creep Parts

| Body part       | Build cost         | Effect per one body part                                     |
| :-------------- | :----------------- | :----------------------------------------------------------- |
| `MOVE`          | 50           | Decreases fatigue by 2 points per tick.                      |
| `WORK`          | 100                | Harvests 2 energy units from a source per tick.Harvests 1 resource unit from a mineral or a deposit per tick.Builds a structure for 5 energy units per tick.Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.Upgrades a controller for 1 energy unit per tick. |
| `CARRY`         | 50                 | Can contain up to 50 resource units.                         |
| `ATTACK`        | 80                 | Attacks another creep/structure with 30 hits per tick in a short-ranged attack. |
| `RANGED_ATTACK` | 150                | Attacks another single creep/structure with 10 hits per tick in a long-range attack up to 3 squares long.Attacks all hostile creeps/structures within 3 squares range with 1-4-10 hits (depending on the range). |
| `HEAL`          | 250                | Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance. |
| `CLAIM`         | 600                | Claims a neutral room controller.Reserves a neutral room controller for 1 tick per body part.Attacks a hostile room controller downgrading its timer by 300 ticks per body parts.Attacks a neutral room controller reservation timer by 1 tick per body parts.A creep with this body part will have a reduced life time of 600 ticks and cannot be renewed. |
| `TOUGH`         | 10                 | No effect, just additional hit points to the creep's body. Can be boosted to resist damage. |





# Simple Strightforward Algorithm
## RCL 1 
Just Harvest and throw in room controller

## RCL 2
Start building structures, also harvesting 

## RCL 3 
Have 10 extensions, which means 300 + 10 * 50 = 800 energy, can start building the optimal harvester (for own room)
parts = [MOVE, MOVE, WORK * 6]
cost  = [50, 50, 100 * 6].sum = 700

coordination needed here

## RCL 4
Use of storage well

## RCL 5
Use links to transport

## RCL 6
Link +1, Extractor, Labs +3,  Terminal

## RCL 7
Extensions.capacity = 100 
Link +1, Labs +3

## RCL 8 
Extension.capacity = 200
Link +2, Labs +4, Observer, Power Spawn


