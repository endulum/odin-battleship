const Ship = require('../ship/ship.js')

module.exports = class Board {
  #cells;
  get cells() { return this.#cells }

  constructor() {
    this.#cells = new Array(10).fill(0).map(() => new Array(10).fill(null));
  }

  changeCell(x, y, value) {
    this.#cells[x].splice(y, 1, value);
  }

  print() {
    let toPrint = ``;

    this.#cells.forEach(row => {
      row.forEach(cell => {
        switch (cell) {
          case 'hit': toPrint += `■ `; break;
          default: toPrint += `□ `;
        }
      });

      toPrint += `\n`;
    });

    console.log(toPrint);
  }
}