export class CellMessage {
    cell;
    constructor(cell) {
        this.cell = cell;
    }
    writeTo(cell) {
        cell.writeCell(this.cell);
    }
}
