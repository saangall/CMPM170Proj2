export class StampManager {
    constructor(scene) {
        this.scene = scene;

        // Current stamp location (top-left of the 2x2 area)
        this.row = null;
        this.col = null;

        // Track stamps collected by each player
        this.scene.player1.stamps = 0;
        this.scene.player2.stamps = 0;

        // Create the stamp as a small red circle
        this.stamp = this.scene.add.circle(0, 0, 8, 0xff4444);
        this.stamp.setStrokeStyle(2, 0xffffff);
        this.stamp.setDepth(5);

        // Display each player's stamp count
        this.stampText = this.scene.add.text(
            720, 100,
            "Player 1 Stamps : 0\nPlayer 2 Stamps : 0",
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        );

        // Spawn the first stamp away from the players at the start of the game
        this.spawnStamp(true);
    }

    
    spawnStamp(firstSpawn = false) {
       let validLocations = [];
       let farLocations = [];

       // Minimum distance from both players for first spawn
       let minimumDistance = 7;

        // Check every possible 2x2 area
        for (let row = 0; row < this.scene.mapDimensions.height - 1; row++) {
           for (let col = 0; col < this.scene.mapDimensions.width - 1; col++) {

               let valid = true;

                // Check all four tiles in the 2x2 area
                for (let r = row; r < row + 2; r++) {
                    for (let c = col; c < col + 2; c++) {

                        if (this.scene.MapDataGrid[r][c] !== null || this.scene.PlayerOccupancy[r][c] !== null) {
                            valid = false;
                        }
                    }
                }

                if (valid) {
                validLocations.push({ row: row, col: col });

                    // Calculate distance to the nearest tile
                    // in the 2x2 area for each player
                    let distanceFromPlayer = (player) => {
                        let nearestRow = Math.max(row,
                            Math.min(player.rowPosition, row + 1));

                        let nearestCol = Math.max(col,
                            Math.min(player.colPosition, col + 1));

                        return Math.abs(player.rowPosition - nearestRow) +
                               Math.abs(player.colPosition - nearestCol);
                    };

                    let distance1 = distanceFromPlayer(this.scene.player1);
                    let distance2 = distanceFromPlayer(this.scene.player2);

                    // Save locations far enough from both players
                    if (distance1 >= minimumDistance &&
                        distance2 >= minimumDistance) {
                        farLocations.push({ row: row, col: col });
                    }
                }
            }
        }

        // First spawn prefers locations far from both players
        let locations = validLocations;

        if (firstSpawn && farLocations.length > 0) {
            locations = farLocations;
        }

        // No available locations
        if (locations.length === 0) {
            this.row = null;
            this.col = null;
            this.stamp.setVisible(false);
            return;
        }

        // Pick a random valid location
        let randomIndex = Math.floor(Math.random() * locations.length);
        let location = locations[randomIndex];

        this.row = location.row;
        this.col = location.col;

        // Position stamp at the 2x2 intersection
        let x = this.scene.mapCornerX +
                (this.col + 1) * this.scene.mapDimensions.cellSize;

        let y = this.scene.mapCornerY +
                (this.row + 1) * this.scene.mapDimensions.cellSize;

        this.stamp.setPosition(x, y);
        this.stamp.setVisible(true);
    }


    checkCollection(player) {
        // No stamp currently on the map
        if (this.row === null) return;

        // Player must have no remaining movement to collect a stamp
        if (player.movementCount !== 0) return;

        // Check if the player entered one of the four stamp tiles
        if (player.rowPosition >= this.row &&
            player.rowPosition <= this.row + 1 &&
            player.colPosition >= this.col &&
            player.colPosition <= this.col + 1) {

            // Add a stamp to the player
            player.stamps += 1;

            // Update stamp counter
            this.stampText.setText(
                "Player 1 Stamps : " + this.scene.player1.stamps +
                "\nPlayer 2 Stamps : " + this.scene.player2.stamps
            );

            // Show collection message
            this.scene.playerMoveInformation.setText(
                "Move Status : Player " + player.playerID +
                " collected a stamp!"
            );

            // Respawn the stamp
            this.spawnStamp();
        }
    }
}
