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

  random() {
    return Math.ceil(Math.random() * 9);
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
    return placedCells;
  }

  changeCell(x, y, value) {
    this.#cells[x].splice(y, 1, value);
  }

  print() {
    let toPrint = ``;

    console.log(toPrint);
  }
}