import Board from "../board/board";
import random0to10 from "../helpers/random0to10";

class Player {
  #yourBoard;
  get yourBoard() { return this.#yourBoard };

  #opponentBoard;
  get opponentBoard() { return this.#opponentBoard };

  #winner = undefined;
  get winner() { return this.#winner }; 

  #isGameRunning = false;
  get isGameRunning() { return this.#isGameRunning };

  constructor() {
    this.#yourBoard = new Board();
    this.#opponentBoard = new Board();
    this.#opponentBoard.placeAllShipsRandomly();
  }

  placeShipByName(shipName, x, y, orientation) {
    this.#yourBoard.placeShipByName(shipName, x, y, orientation);
    if (Object.keys(this.#yourBoard.shipCoordinates).every(ship => {
      return this.#yourBoard.shipCoordinates[ship].length > 0
    })) {
      this.#isGameRunning = true;
    }
  }

  placeAllShipsRandomly() {
    this.#yourBoard.placeAllShipsRandomly();
    this.#isGameRunning = true;
  }

  yourMove(x, y) {
    if (this.#isGameRunning) {
      if (this.opponentBoard.isValidToHit(x, y)) {
        this.#opponentBoard.receiveHit(x, y);
        this.checkWinner();
        if (this.#isGameRunning) this.yourBoard.receiveRandomHit();
        this.checkWinner();
      }
    }
  }

  makeRandomMove() {
    if (this.#isGameRunning) {
      let x = random0to10();
      let y = random0to10();
      while (!this.#opponentBoard.isValidToHit(x, y)) {
        x = random0to10();
        y = random0to10();
      }

      this.yourMove(x, y);
    }
  }

  checkWinner() {
    if (this.#opponentBoard.isAllSunk()) {
      this.#winner = 'PLAYER';
      this.#isGameRunning = false;
      this.announceWinner();
    } 
    
    if (this.#yourBoard.isAllSunk()) {
      this.#winner = 'COMPUTER';
      this.#isGameRunning = false;
      this.announceWinner();
    }
  }

  announceWinner() {
    console.log(`The winner is ${this.#winner}`);
  }
}

export default Player;