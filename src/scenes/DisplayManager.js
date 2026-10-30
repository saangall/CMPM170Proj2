export class DisplayManager {
    constructor(scene) {
    this.scene = scene;
    }
        // I suggest making warnings popups in the middle of the screen like "YOU NEED A PASSPORT TO DO X"
        // Clarifications like what tile is what could be some sort of openable display via button?
        // feel free to add to this class if necessary for the UI
        updateInformation(){
        let currentColor = (this.scene.currentPlayerTurn === 1) ? this.scene.player1.color : this.scene.player2.color;

        this.scene.playerMoveInformation.setColor(Phaser.Display.Color.IntegerToColor(currentColor).rgba);
        this.scene.movesLeftInformation.setColor(Phaser.Display.Color.IntegerToColor(currentColor).rgba);
        this.scene.movesLeftInformation2.setColor(Phaser.Display.Color.IntegerToColor(currentColor).rgba);
        this.scene.playerMoveInformation.setText("CURRENT PLAYER TURN : " + (this.scene.currentPlayerTurn === 1 ? "1" : "2"));
        this.scene.movesLeftInformation.setText((this.scene.currentPlayerTurn === 1 ? this.scene.player1.movementCount : this.scene.player2.movementCount));
        this.scene.p1text.setText(

            "Player 1 Passport/Information " + "\n-------------------------------------------"
            + "\nPassport Status : " + (this.scene.player1.passport ? "OBTAINED" : "UNOBTAINED")
            + "\nStamps : " + this.scene.player1.countriesCollected
            + "\nStamp Count : " + this.scene.player1.stamps);
            //+ "\nMoney : " + this.player1.money
            //+ "\nWorld Position : (" + this.player1.rowPosition + ", " + this.player1.colPosition + ")"
            //+ "\n[Not Implemented] Visas : " + this.player1.visas);
        this.scene.p2text.setText(

            "Player 2 Passport/Information " + "\n-------------------------------------------"
            + "\nPassport Status : " + (this.scene.player2.passport ? "OBTAINED" : "UNOBTAINED")
            + "\nUnique Stamps : " + this.scene.player2.countriesCollected
            + "\nStamp Count : " + this.scene.player2.stamps);
            //+ "\nMoney : " + this.player2.money
            //+ "\nWorld Position : (" + this.player2.rowPosition + ", " + this.player2.colPosition + ")"
            //+ "\n[Not Implemented] Visas : " + this.player2.visas);
    }
}