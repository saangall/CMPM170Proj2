export class Cloud {
    constructor(scene, row, col) {
        this.scene = scene;
        // Position is the top-left tile of the 2x2 area.
        this.rowPosition = Math.min(row, scene.mapDimensions.height - 2);
        this.colPosition = Math.min(col, scene.mapDimensions.width - 2);
        this.age = 0;
        this.maxAge = 3; // Subsequent player turns, excluding the placement turn.
        this.placedThisTurn = true;

        const size = scene.mapDimensions.cellSize;
        const footprint = scene.add.rectangle(0, 0, size * 2, size * 2, 0x64748b, 0.3);
        footprint.setStrokeStyle(2, 0xcbd5e1);
        this.icon = scene.add.container(0, 0, [
            footprint,
            scene.add.circle(-size * 0.45, size * 0.1, size * 0.45, 0xcbd5e1),
            scene.add.circle(0, -size * 0.2, size * 0.6, 0xcbd5e1),
            scene.add.circle(size * 0.45, size * 0.1, size * 0.45, 0xcbd5e1)
        ]);
        this.icon.setDepth(10).setAlpha(0.6);
        this.updatePosition();
    }

    move(rowChange, colChange) {
        const row = this.rowPosition + rowChange;
        const col = this.colPosition + colChange;
        // Keep the entire 2x2 footprint inside the map.
        if (row < 0 || col < 0 || row + 1 >= this.scene.mapDimensions.height ||
            col + 1 >= this.scene.mapDimensions.width) return;
        this.rowPosition = row;
        this.colPosition = col;
        this.updatePosition();
    }

    updatePosition() {
        const size = this.scene.mapDimensions.cellSize;
        this.icon.setPosition(
            this.scene.mapCornerX + (this.colPosition + 1) * size,
            this.scene.mapCornerY + (this.rowPosition + 1) * size
        );
    }

    covers(row, col) {
        return row >= this.rowPosition && row < this.rowPosition + 2 &&
            col >= this.colPosition && col < this.colPosition + 2;
    }

    place() {
        this.icon.setAlpha(1);
    }

    advanceAge() {
        if (this.placedThisTurn) {
            this.placedThisTurn = false;
            return false;
        }
        this.age += 1;
        return this.age >= this.maxAge;
    }

    destroy() {
        this.icon.destroy();
    }
}
