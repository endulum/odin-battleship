const Ship = require('../ship/ship.js')

module.exports = class Board {
  #ships = [];
  get ships() { return this.#ships }

  #cells;
  get cells() { return this.#cells }

  #occupiedCells = {}
  get occupiedCells() { return this.#occupiedCells }

  #hitCells = [];
  get hitCells() { return this.#hitCells }

  constructor() {
    this.#cells = new Array(10).fill(0).map(() => new Array(10).fill('empty'));

    [
      ['Carrier', 5],
      ['Battleship', 4],
      ['Destroyer', 3],
      ['Submarine', 3],
      ['Patrol Boat', 2]
    ].forEach(ship => {
      this.#ships.push(new Ship(ship[0], ship[1]));
      this.#occupiedCells[ship[0]] = [];
    });
  }

  randomlyPlaceShips() {
    this.#ships.forEach(ship => {
      while (this.#occupiedCells[ship.name].length === 0) {
        this.#occupiedCells[ship.name] = this.placeShip(this.random(), this.random(), ship, this.randomOrientation());
      }
    });
  }

  placeShip(x, y, ship, orientation = 'horizontal') {
    const placedCells = [];
    if (orientation === 'horizontal') {
      if (x + ship.length < 10) {
        for (let i = 0; i < ship.length; i++) {
          placedCells.push([x + i, y]);
        }
      }
    }
    if (orientation === 'vertical') {
      if (y + ship.length < 10) {
        for (let i = 0; i < ship.length; i++) {
          placedCells.push([x, y + i]);
        }
      }
    }
    if (placedCells.some(cell => this.isCellOccupied(cell))) return [];
    return placedCells;
  }

  changeCell(x, y, value) {
    this.#cells[x].splice(y, 1, value);
  }

  print() {
    let toPrint = ``;

    this.#cells.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (this.isCellOccupied([rowIndex, columnIndex])) {
          toPrint += `■ `;
        } else toPrint += `□ `;
      });
      toPrint += `\n`;
    });

    console.log(toPrint);
  }

  random() {
    return Math.ceil(Math.random() * 9);
  }

  randomOrientation() {
    return (Math.floor(Math.random() * 2) == 1 ? 'vertical' : 'horizontal')
  }

  compareCoords(coord1, coord2) {
    return (
      (coord1[0] === coord2[0]) &&
      (coord1[1] === coord2[1])
    )
  }

  isCellOccupied(coords) {
    return this.#ships.some(ship => {
      return this.#occupiedCells[ship.name].some(coord => {
        return this.compareCoords(coords, coord);
      });
    });
  }
}