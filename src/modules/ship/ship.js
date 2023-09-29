module.exports = class Ship {
  #name;
  get name() { return this.#name }

  #length;
  get length() { return this.#length }

  #hits = 0;
  get hits() { return this.#hits }
  
  hit() {
    if (!this.isSunk()) this.#hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }

  constructor(name, length) {
    this.#name = name;
    this.#length = parseInt(length);
  }
}