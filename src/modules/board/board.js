import Ship from '../ship/ship';

class Board {
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

  receiveRandomHit() {
    let x = this.random();
    let y = this.random();
    while (this.isCellHit([x, y])) {
      x = this.random();
      y = this.random();
    }
    
    this.receiveHit(x, y);
  }

  receiveHit(x, y) {
    if (this.#hitCells.every(cell => !this.compareCoords(cell, [x, y])) && (
      (x < 10) && (x >= 0) &&
      (y < 10) && (y >= 0)
    )) {
      this.#hitCells.push([x, y]);
      this.hitShip([x, y]);
    }
  }

  hitShip(hitCoord) {
    this.#ships.forEach(ship => {
      if (this.#occupiedCells[ship.name].some(coords => this.compareCoords(coords, hitCoord))) {
        ship.hit();
      }
    })
  }

  print() {
    let toPrint = ``;

    this.#cells.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (this.isCellOccupied([rowIndex, columnIndex])) {
          if (this.isCellHit([rowIndex, columnIndex])) toPrint += `x `;
          else toPrint += `■ `;
        } else {
          if (this.isCellHit([rowIndex, columnIndex])) toPrint += `x `;else toPrint += `□ `;
        }
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

  isCellHit(coords) {
    return this.#hitCells.some(cell => {
      return this.compareCoords(coords, cell);
    })
  }
}

export default Board;