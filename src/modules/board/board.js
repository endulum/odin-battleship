module.exports = class Board {
  #cells;
  get cells() { return this.#cells }

  constructor() {
    this.#cells = Array(10).fill(Array(10).fill(null));
  }

  print() {
    let toPrint = ``;
    
    this.#cells.forEach(row => {
      this.#cells.forEach(cell => {
        toPrint += `■`;
      });
      toPrint += `\n`;
    });

    return toPrint;
  }
}