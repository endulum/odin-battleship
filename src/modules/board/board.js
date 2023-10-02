import Ship from '../ship/ship';

class Board {

  // fields, getters

  #receivedHits = [];
  get receivedHits() { return this.#receivedHits };

  // methods

  clearHits() { 
    this.#receivedHits = [] 
  }

  receiveHit(x, y) {
    if (this.isValidToHit(x, y)) {
      this.#receivedHits.push([x, y]);
      this.#receivedHits.sort();
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

  random0to10() {
    return Math.floor(Math.random() * 10);
  }

  compareCoordinates(coords1, coords2) {
    return (
      (coords1[0] === coords2[0]) &&
      (coords1[1] === coords2[1])
    )
  }

  isHit(x, y) {
    return this.#receivedHits.some(hit => {
      return this.compareCoordinates(hit, [x, y]);
    });
  }

  isValidToHit(x, y) {
    return (
      (!this.isHit(x, y) && (
        (x < 10) && (x >= 0) &&
        (y < 10) && (y >= 0)
      ))
    )
  }
}

export default Board;