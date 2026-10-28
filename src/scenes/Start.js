import { MapOneData } from './MapData.js';
import { StampManager } from './StampManager.js';
export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');

    }

    create() {
        // strict map size
        this.mapDimensions = { width: 29, height: 10, cellSize: 40 };
        // top left
        this.mapCornerX = 50;
        this.mapCornerY = 50;
        // draw initial grid graphics
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x223818, 1);
        for (let row = 0; row < this.mapDimensions.height; row++) {
            for (let col = 0; col < this.mapDimensions.width; col++) {
                const x = this.mapCornerX + col * this.mapDimensions.cellSize;
                const y = this.mapCornerY + row * this.mapDimensions.cellSize;
                graphics.strokeRect(x, y, this.mapDimensions.cellSize, this.mapDimensions.cellSize);
            }
        }

        // Grid to store general map tile ID's for obstacles/interactions/collectibles
        // All Tile IDs are listed in MapData.js
        this.MapDataGrid = [];
        for (let row = 0; row < this.mapDimensions.height; row++) {
            this.MapDataGrid[row] = [];
            for (let col = 0; col < this.mapDimensions.width; col++) {
                this.MapDataGrid[row][col] = null;
            }
        }

        // Set IDs
        for (let tileData of MapOneData) {
            this.MapDataGrid[tileData[0]][tileData[1]] = tileData[2];
        }

        // Grid to store ID's for map tiles with destinations field
        this.Destinations = [];
        for (let row = 0; row < this.mapDimensions.height; row++) {
            this.Destinations[row] = [];
            for (let col = 0; col < this.mapDimensions.width; col++) {
                this.Destinations[row][col] = null;
            }
        }

        // Destination checked in MakeMove()
        for (let tileData of MapOneData) {
            let [y, x, tileID, destination] = tileData;
            if (destination !== undefined) {
                this.Destinations[y][x] = destination;
            }
        }

        // Player occupancy grid mask to keep players from occupying/passing the same spot
        // It's a separate grid because tracking it in MapDataGrid would override permanent interactable ID's
        // Sorry for the amount of grids. This should be as many grids as needed. (Unless we implement map 2)
        // Maybe we can just make the main grid bigger and keep both 'maps' in the same grid? upvotes: 1 downvotes: 0
        this.PlayerOccupancy = [];
        for (let row = 0; row < this.mapDimensions.height; row++) {
            this.PlayerOccupancy[row] = [];
            for (let col = 0; col < this.mapDimensions.width; col++) {
                this.PlayerOccupancy[row][col] = null;
            }
        }

        // Color the grid based on tile ID's
        for (let row = 0; row < this.mapDimensions.height; row++) {
            for (let col = 0; col < this.mapDimensions.width; col++) {
                let tileID = this.MapDataGrid[row][col];
                let color;
                let tileSize;

                switch (tileID) {
                    default:
                        color = 0x000000;
                        tileSize = this.mapDimensions.cellSize * 0.5
                        break;
                    // Blue Water
                    case 7:
                        color = 0x5d6e9c;
                        tileSize = this.mapDimensions.cellSize;
                        break;
                    // Brown Mountains
                    case 8:
                        color = 0x451e10;
                        tileSize = this.mapDimensions.cellSize;
                        break;
                    // Orange Travel Point (Dual Direction)
                    case 10:
                        color = 0xf28955;
                        tileSize = this.mapDimensions.cellSize * 0.2;
                        break;
                    // Pink Travel Point (Single Direction)
                    case 11:
                        color = 0xFA86C4;
                        tileSize = this.mapDimensions.cellSize * 0.2;
                        break;
                    // Golden Passport Claim
                    case 12:
                        color = 0xffa408;
                        tileSize = this.mapDimensions.cellSize * 0.80;
                        break;
                    // weather item 
                    case 5:
                        color = 0x204fff;
                        tileSize = this.mapDimensions.cellSize * 0.60;
                        break;

                }
                this.add.rectangle(
                    this.mapCornerX + col * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
                    this.mapCornerY + row * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
                    tileSize,
                    tileSize,
                    color
                );
            }
        }

        // Player objects
        this.player1 = {
            playerID: 1,
            rowPosition: 4,
            colPosition: 1,
            passport: false,
            visas: ["Contree"],
            hasTurn: false,
            movementCount: 0,
            money: 0
        }

        this.player2 = {
            playerID: 2,
            rowPosition: 5,
            colPosition: 1,
            passport: false,
            visas: ["Contree"],
            hasTurn: false,
            movementCount: 0,
            money: 0
        }

        this.currentPlayerTurn = 1;

        // add players [P1 - White] [P2 - Gray]
        this.PlayerOccupancy[this.player2.rowPosition][this.player2.colPosition] = 2;
        this.icon2 = this.add.rectangle(
            this.mapCornerX + this.player2.colPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
            this.mapCornerY + this.player2.rowPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
            this.mapDimensions.cellSize * 0.5,
            this.mapDimensions.cellSize * 0.5,
            0x808080
        )
        this.PlayerOccupancy[this.player1.rowPosition][this.player1.colPosition] = 1;
        this.icon1 = this.add.rectangle(
            this.mapCornerX + this.player1.colPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
            this.mapCornerY + this.player1.rowPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
            this.mapDimensions.cellSize * 0.5,
            this.mapDimensions.cellSize * 0.5,
            0xffffff
        )

        // Controls and initial turn setting
        this.cursors = this.input.keyboard.createCursorKeys();
        this.roll = Math.floor(Math.random() * 6) + 1;
        this.player1.movementCount = this.roll;


        // Informational Text Box
        this.p1text = this.add.text(100, 475, "Text", { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' });
        this.p2text = this.add.text(500, 475, "Text", { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' });
        this.playerMoveInformation = this.add.text(100, 20, "Move Status : ", { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' });
        this.warning = "";

        // Create the stamp system
        this.stampManager = new StampManager(this);
    }

    update(time) {
        // Update Information Text Box
        this.playerMoveInformation.setText("Move Status : " + this.warning + " | Current Player Turn : " + (this.currentPlayerTurn === 1 ? this.player1.playerID : this.player2.playerID) + " | Movement Roll = " + this.roll + " | Amount of Moves Left : " + (this.currentPlayerTurn === 1 ? this.player1.movementCount : this.player2.movementCount));
        this.p1text.setText(

            "Player 1 Passport/Information " + "\n-------------------------------------------"
            + "\nPassport Status : " + (this.player1.passport ? "OBTAINED" : "UNOBTAINED")
            // Stamps should display "Stamps : Contree, Lix Leveny" if a stamp from each country is obtained. Check ID of tile in MapDataGrid the player is standing
            // on during map collection to update this field, which you still need to add in the player objects.
            + "\nStamps : "
            + "\nMoney : " + this.player1.money
            + "\nWorld Position : (" + this.player1.rowPosition + ", " + this.player1.colPosition + ")"
            + "\n[Not Implemented] Visas : " + this.player1.visas);
        this.p2text.setText(

            "Player 2 Passport/Information " + "\n-------------------------------------------"
            + "\nPassport Status : " + (this.player2.passport ? "OBTAINED" : "UNOBTAINED")
            // Stamps should display "Stamps : Contree, Lix Leveny" if a stamp from each country is obtained. Check ID of tile in MapDataGrid the player is standing
            // on during map collection to update this field, which you still need to add in the player objects. [CONTREE IS ID 13, LIX LEVENY ARE ID'D AS NULL]
            + "\nStamps : "
            + "\nMoney : " + this.player2.money
            + "\nWorld Position : (" + this.player2.rowPosition + ", " + this.player2.colPosition + ")"
            + "\n[Not Implemented] Visas : " + this.player2.visas);

        // Controls
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            if (this.currentPlayerTurn == 1) {
                this.makeMove(this.player1, this.player1.rowPosition, this.player1.colPosition - 1);
            } else if (this.currentPlayerTurn == 2) {
                this.makeMove(this.player2, this.player2.rowPosition, this.player2.colPosition - 1);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            if (this.currentPlayerTurn == 1) {
                this.makeMove(this.player1, this.player1.rowPosition, this.player1.colPosition + 1);
            } else if (this.currentPlayerTurn == 2) {
                this.makeMove(this.player2, this.player2.rowPosition, this.player2.colPosition + 1);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            if (this.currentPlayerTurn == 1) {
                this.makeMove(this.player1, this.player1.rowPosition + 1, this.player1.colPosition);
            }
            else if (this.currentPlayerTurn == 2) {
                this.makeMove(this.player2, this.player2.rowPosition + 1, this.player2.colPosition);
            }
        }
        if (Phaser.Input.Keyboard.JustUp(this.cursors.up)) {
            if (this.currentPlayerTurn == 1) {
                this.makeMove(this.player1, this.player1.rowPosition - 1, this.player1.colPosition);
            }
            else if (this.currentPlayerTurn == 2) {
                this.makeMove(this.player2, this.player2.rowPosition - 1, this.player2.colPosition);
            }
        }
    }

    // Utility functions

    // Self explanatory
    D6() {
        this.roll = Math.floor(Math.random() * 6) + 1;
        this.playerMoveInformation.setText("Move Status : " + this.warning + " | Current Player Turn : " + (this.currentPlayerTurn === 1 ? this.player1.playerID : this.player2.playerID) + " | Movement Roll = " + this.roll + " | Amount of Moves Left : " + (this.currentPlayerTurn === 1 ? this.player1.movementCount : this.player2.movementCount));
        return this.roll;
    }

    makeMove(player, newRow, newCol) {
        // Border, Obstacle, and Player Occupancy checks to block invalid moves
        if (newRow < 0 || newRow >= this.mapDimensions.height || newCol < 0 || newCol >= this.mapDimensions.width) return;
        if (this.MapDataGrid[newRow][newCol] == 2 || this.MapDataGrid[newRow][newCol] == 1 || this.MapDataGrid[newRow][newCol] == 7 || this.MapDataGrid[newRow][newCol] == 8) return;
        if (this.PlayerOccupancy[newRow][newCol] !== null) return;

        // Interaction non-related to player movement
        if (this.MapDataGrid[newRow][newCol] == 12) player.passport = true;

        // Clear old position in occupancy and update player object data
        this.PlayerOccupancy[player.rowPosition][player.colPosition] = null;
        player.rowPosition = newRow;
        player.colPosition = newCol;

        // Travel point override
        let destination = this.Destinations[newRow][newCol]
        if (destination !== null) {
            if (player.passport) {
                console.log(destination);
                player.rowPosition = destination[0];
                player.colPosition = destination[1];
            } else {
                this.warning = "NEED PASSPORT TO TRAVEL";
            }
        }


        // Update sprite location
        if (player == this.player1) {
            this.icon1.setPosition(
                this.mapCornerX + player.colPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
                this.mapCornerY + player.rowPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2
            )
        }
        if (player == this.player2) {
            this.icon2.setPosition(
                this.mapCornerX + player.colPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2,
                this.mapCornerY + player.rowPosition * this.mapDimensions.cellSize + this.mapDimensions.cellSize / 2
            )
        }

        // Update move count, set occupancy grid
        player.movementCount = player.movementCount - 1;
        this.PlayerOccupancy[player.rowPosition][player.colPosition] = player.playerID;

        // Check for stamp collection
        this.stampManager.checkCollection(player);

        console.log("Player " + player.playerID + " Remaining Movement : " + player.movementCount);

        // If no movement left, switch turns
        if (player.movementCount > 0) return;
        switch (this.currentPlayerTurn) {
            case 1:
                this.currentPlayerTurn = 2;
                this.warning = "";
                this.player2.movementCount = this.D6();
                /*console.log("Player 1 X : " + this.player1.colPosition + " | Player 1 Y : " + this.player1.rowPosition);
                console.log("Player 2 Dice Roll Outcome : " + this.player2.movementCount);
                */
                break;
            case 2:
                this.currentPlayerTurn = 1;
                this.warning = "";
                this.player1.movementCount = this.D6();
                /*console.log("Player 2 X : " + this.player2.colPosition + " | Player 2 Y : " + this.player2.rowPosition);
                console.log("Player 1 Dice Roll Outcome : " + this.player1.movementCount);*/
                break;
        }
    }
}
