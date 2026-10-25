
// Y[ROW], X[COLUMN], TILE ID, DESTINATION [if applicable]
// Each list object is data for one tile. Only tiles with something on it need data.
export const MapOneData = [[0,0,7],[0,1,7],[0,2,7],[0,3,7],[0,4,7],[0,5,7],[0,6,7],[0,7,7],[0,8,7],[0,9,7],[0,10,7],[0,11,7],[0,13,7],
                           [1,0,7],[1,1,7],[1,5,7],[1,9,7],[1,13,7],[2,0,7],[2,12,7],[2,13,7],[3,13,7],[5,0,7],[5,12,7],[6,0,7],[6,11,7],[6,12,7],
                           [6,13,7],[7,0,7],[7,1,7],[7,8,7],[7,10,7],[7,11,7],[8,0,7],[8,4,7],[8,8,7],[8,9,7],[8,10,7],[8,11,7],[8,13,7],
                           [9,0,7],[9,1,7],[9,4,7],[9,5,7],[9,7,7],[9,8,7],[9,9,7],[9,10,7],[9,11,7],[9,13,7], [1,6,8], [1,7,8],[2,6,8],[3,5,8],
                           [3,6,8],[4,6,8],[6,7,8],[6,8,8],[7,6,8],[7,7,8],[8,7,8],[7,9,10,[7,12]], [7,12,10,[7,9]], [3,8,12]];

        // TILE IDs
        // 1 --> player 1 // DO NOT ADD TO DATA
        // 2 --> player 2 // DO NOT ADD TO DATA
        // 3 --> player 3 implemented if time permits 
        // 4 --> collectable stamp // Needs spawning mechanics and implementation
        // 5 --> collectible weather item // Needs spawning mechanics and implementation
        // 6 --> collectible money location // Needs spawning mechanics and implementation
        // 7 --> permanent obstacles [water] // -> Implemented for Map One <-
        // 8 --> permanent obstacles [mountain] // -> Implemented for Map One <-
        // 9 --> impermanent obstacles  // Tied to weather item [5]
        // 10 --> back and forth transport space // -> Implemented for Map One <-
        // 11 --> single destination transport space // Needs implementation
        // 12 --> passport claim location // -> Implemented for Map One <- ( will probably only be in map one )

