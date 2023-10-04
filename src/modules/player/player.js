import Board from "../board/board";

class Player {
  #yourBoard;
  get yourBoard() { return this.#yourBoard };

  #computerBoard;
  get computerBoard() { return this.#computerBoard };

  constructor() {
    this.#yourBoard =  new Board();
    this.#yourBoard.placeAllShipsRandomly();
    this.#computerBoard = new Board();
    this.#computerBoard.placeAllShipsRandomly();
  }
}

export default Player;