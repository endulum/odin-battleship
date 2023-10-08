import Ship from '../ship/ship';
import random0to10 from '../helpers/random0to10';
import isInBounds from '../helpers/isInBounds';
import compareCoords from '../helpers/compareCoords';

class Board {

  #ships;
  get ships() { return this.#ships }

  #shipCoords;
  get shipCoords() { return this.#shipCoords }

  #hitCoords;
  get hitCoords() { return this.#hitCoords }

  constructor() {
    this.clearAll();
  }

  clearAll() {
    this.#ships = [];
    this.#shipCoords = {};
    this.#hitCoords = [];

    [
      ['Carrier', 5],
      ['Battleship', 4],
      ['Destroyer', 3],
      ['Submarine', 3],
      ['Patrol Boat', 2]
    ].forEach(ship => {
      this.#ships.push(new Ship(ship[0], ship[1]));
      this.#shipCoords[ship[0]] = [];
    });
  }

  placeShip(shipName, x, y, orientation) {
    const ship = this.getShipByName(shipName);

    if (
      (this.#shipCoords[shipName].length > 0) ||
      (!isInBounds(x, y)) ||
      (orientation === 'horizontal' && !isInBounds(x + ship.length - 1, y)) ||
      (orientation === 'vertical' && !isInBounds(x, y + ship.length - 1))
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

    if (placementCoordinates.some(coords => {
      return this.isCoordOccupied(coords[0], coords[1]);
    })) return;

    this.#shipCoords[ship.name] = placementCoordinates;
  }

  placeAllShipsRandomly() {
    Object.keys(this.#shipCoords).forEach(shipName => {
      while (this.#shipCoords[shipName].length === 0) {
        this.placeShip(shipName, random0to10(), random0to10(), this.randomOrientation());
      }
    });
  }

  receiveHit(x, y) {
    if (this.isValidToHit(x, y)) {
      this.#hitCoords.push([x, y]);
      if (this.isCoordOccupied(x, y)) {
        this.getShipByName(this.isCoordOccupied(x, y)).hit();
      }
    }
  }

  receiveRandomHit() {
    let x = random0to10();
    let y = random0to10();
    while (!this.isValidToHit(x, y)) {
      x = random0to10();
      y = random0to10();
    }
    this.receiveHit(x, y);
  }

  isAllSunk() {
    return this.#ships.every(ship => ship.isSunk());
  }

  // is this coordinate hit?
  //// used to render hits in dom
  isCoordHit(x, y) {
    return this.#hitCoords.some(coord => {
      return compareCoords([x, y], coord);
    })
  }

  // is this coordinate occupied? by which ship?
  //// used to render ship placement in dom
  isCoordOccupied(x, y) {
    let shipName;
    Object.keys(this.#shipCoords).forEach(ship => {
      this.#shipCoords[ship].forEach(coord => {
        if (compareCoords(coord, [x, y])) {
          shipName = ship;
        }
      });
    });
    return shipName ? shipName : false;
  }

  // is this coordinate valid to hit?
  //// used to render clickable areas in dom
  isValidToHit(x, y) {
    return !this.isAllSunk() && isInBounds(x, y) && !this.isCoordHit(x, y);
  }

  getAllOccupied() {
    const occupied = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (this.isCoordOccupied(x, y)) {
          occupied.push([x, y]);
        }
      }
    }
    return occupied;
  }

  getShipByName(shipName) {
    return this.#ships.find(ship => ship.name === shipName);
  }

  getFirstUnplacedShip() {
    const shipName = Object.keys(this.#shipCoords).find(ship => {
      return this.#shipCoords[ship].length === 0;
    });
    return shipName ? shipName : false;
  }

  randomOrientation() {
    return Math.floor(Math.random() * 2) === 1 ? 'horizontal' : 'vertical';
  }
}

export default Board;