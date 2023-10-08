import Board from "../board/board";
// import random0to10 from "../helpers/random0to10";

class Player {
  #yourBoard;
  get yourBoard() { return this.#yourBoard }

  #opponentBoard;
  get opponentBoard() { return this.#opponentBoard }

  #winner;
  get winner() { return this.#winner };

  #isGameRunning = false;
  get isGameRunning() { return this.#isGameRunning };

  constructor() {
    this.clearAll();
  }

  clearAll() {
    this.#winner = null;
    this.#yourBoard = new Board();
    this.#opponentBoard = new Board();
    this.#opponentBoard.placeAllShipsRandomly();
  }

  placeShip(shipName, x, y, orientation) {
    this.#yourBoard.placeShip(shipName, x, y, orientation);
    if (!this.#yourBoard.getFirstUnplacedShip()) {
      this.#isGameRunning = true;
    }
  }

  placeAllShipsRandomly() {
    this.#yourBoard.placeAllShipsRandomly();
    this.#isGameRunning = true;
  }

  yourMove(x, y) {
    if (this.#isGameRunning) {
      if (this.#opponentBoard.isValidToHit(x, y)) {
        this.#opponentBoard.receiveHit(x, y);
        this.checkWinner();
        if (this.#isGameRunning) this.yourBoard.receiveRandomHit();
        this.checkWinner();
      }
    }
  }

  makeRandomMove() {
    if (this.#isGameRunning) {
      this.#opponentBoard.receiveRandomHit();
      this.checkWinner();
      if (this.#isGameRunning) this.yourBoard.receiveRandomHit();
      this.checkWinner();
    }
  }

  checkWinner() {
    if (this.#opponentBoard.isAllSunk()) {
      this.#winner = 'PLAYER';
      this.#isGameRunning = false;
    } 
    
    if (this.#yourBoard.isAllSunk()) {
      this.#winner = 'COMPUTER';
      this.#isGameRunning = false;
    }
  }
}

export default Player;