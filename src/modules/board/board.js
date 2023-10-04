import Ship from '../ship/ship';

class Board {

  constructor() {
    this.clear();
  }

  // fields, getters

  #ships;
  get ships() { return this.#ships }

  #shipCoordinates;
  get shipCoordinates() { return this.#shipCoordinates }

  #receivedHits;
  get receivedHits() { return this.#receivedHits };

  // methods

  clearShips() {
    this.#ships = [];
    this.#shipCoordinates = {};

    [
      ['Carrier', 5],
      ['Battleship', 4],
      ['Destroyer', 3],
      ['Submarine', 3],
      ['Patrol Boat', 2]
    ].forEach(ship => {
      this.#ships.push(new Ship(ship[0], ship[1]));
      this.#shipCoordinates[ship[0]] = [];
    });
  }

  placeShip(ship, x, y, orientation) {
    if (
      // the ship already has set coords
      (this.#shipCoordinates[ship.name].length > 1) ||
      // the starting coordinates are out of bounds
      !this.isInBounds(x, y) ||
      // in horizontal, the end coordinates are out of bounds
      (orientation === 'horizontal' && !this.isInBounds(x + ship.length, y)) ||
      // in vertical, the end coordinates are out of bounds
      (orientation === 'vertical' && !this.isInBounds(x, y + ship.length))
    ) return;

    const placementCoordinates = [];

    if (orientation === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        placementCoordinates.push([x, y + i]);
      }
    } else if (orientation === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        placementCoordinates.push([x + i, y]);
      }
    }

    if (this.getOccupied().some(coord1 => {
      return placementCoordinates.some(coord2 => {
        return this.compareCoordinates(coord1, coord2);
      }) // any of the coords this will occupy is already occupied
    })) return;

    this.#shipCoordinates[ship.name] = placementCoordinates;
  }

  placeShipByName(shipName, x, y, orientation) {
    const foundShip = this.getShipByName(shipName);
    if (foundShip) {
      this.placeShip(foundShip, x, y, orientation);
    }
  }

  placeAllShipsRandomly() {
    this.#ships.forEach(ship => {
      while (this.#shipCoordinates[ship.name].length === 0) {
        this.placeShip(ship, this.random0to10(), this.random0to10(), this.randomOrientation());
      }
    });
  }

  damageShipByName(shipName) {
    const foundShip = this.getShipByName(shipName);
    if (foundShip) {
      foundShip.hit();
    }
  }

  clearHits() { 
    this.#receivedHits = [];
  }

  receiveHit(x, y) {
    if (this.isValidToHit(x, y)) {
      this.#receivedHits.push([x, y]);
      this.#receivedHits.sort();

      Object.keys(this.#shipCoordinates).forEach(ship => {
        this.#shipCoordinates[ship].forEach(coord => {
          if (this.compareCoordinates(coord, [x, y])) {
            this.damageShipByName(ship);
          }
        })
      })
    }
  }

  receiveRandomHit() {
    let x = this.random0to10();
    let y = this.random0to10();
    while (this.isHit(x, y)) {
      x = this.random0to10();
      y = this.random0to10();
    }
    this.receiveHit(x, y);
  }

  // helpers

  clear() {
    this.clearShips();
    this.clearHits();
  }

  random0to10() {
    return Math.floor(Math.random() * 10);
  }

  randomOrientation() {
    return Math.floor(Math.random() * 2) === 1 ? 'horizontal' : 'vertical';
  }

  getOccupied() {
    const occupied = [];
    if (Object.keys(this.#shipCoordinates).length > 0) {
      Object.keys(this.#shipCoordinates).forEach(shipName => {
        this.#shipCoordinates[shipName].forEach(coord => {
          occupied.push(coord);
        })
      })
    }
    return occupied;
  }

  getShipByName(shipName) {
    return this.#ships.find(ship => ship.name === shipName)
  }

  isOccupied(x, y) {
    return this.getOccupied().some(occupiedCell => {
      return this.compareCoordinates(occupiedCell, [x, y]);
    });
  }

  compareCoordinates(coords1, coords2) {
    return (
      (coords1[0] === coords2[0]) &&
      (coords1[1] === coords2[1])
    )
  }

  isInBounds(x, y) {
    return (
      (x < 10) && (x >= 0) &&
      (y < 10) && (y >= 0)
    )
  }

  isHit(x, y) {
    return this.#receivedHits.some(hit => {
      return this.compareCoordinates(hit, [x, y]);
    });
  }

  isValidToHit(x, y) {
    return !this.isHit(x, y) && this.isInBounds(x, y);
  }

  isAllSunk() {
    return this.#ships.every(ship => ship.isSunk());
  }

  // print

  print() {
    let grid = ``;
    for (let y = 0; y < 10; y++) { // columns
      for (let x = 0; x < 10; x++) { // rows
        if (this.isOccupied(x, y)) {
          if (this.isHit(x, y)) {
            grid += `■ `;
          } else {
            grid += `• `;
          }
        } else {
          if (this.isHit(x, y)) {
            grid += `□ `;
          } else {
            grid += `• `;
          }
        }
      }; grid += `\n`;
    }

    console.log(grid);
  }
}

export default Board;