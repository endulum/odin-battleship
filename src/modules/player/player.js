import Board from "../board/board";

class Player {
  #yourBoard;
  get yourBoard() { return this.#yourBoard };

  #computerBoard;
  get computerBoard() { return this.#computerBoard };

  #winner;
  get winner() { return this.#winner };

  constructor(computerVersusComputer) {
    this.#yourBoard = new Board();
    this.#computerBoard = new Board();
    this.#computerBoard.placeAllShipsRandomly();

    // make cpus fight each other...

    if (computerVersusComputer) {
      this.#yourBoard.placeAllShipsRandomly();
      const [x, y] = this.findValidRandomMove();
      this.yourTurn(x, y, true);
    }
  }

  yourTurn(x, y, computerVersusComputer) {
    this.computerBoard.receiveHit(x, y);
    if (this.checkWinner()) return;
    this.#yourBoard.receiveRandomHit();
    if (this.checkWinner()) return;

    if (computerVersusComputer) {
      const [x, y] = this.findValidRandomMove();
      this.yourTurn(x, y, true);
    }
  }

  checkWinner() {
    if (this.#computerBoard.isAllSunk()) {
      this.#winner = 'PLAYER';
      this.announceWinner();
      return true;
    }
    
    if (this.#yourBoard.isAllSunk()) {
      this.#winner = 'COMPUTER';
      this.announceWinner();
      return true;
    }

    return false;
  }

  announceWinner() {
    console.log(`The winner is ${this.#winner}`);
  }

  // helper

  findValidRandomMove() {
    let x = this.random0to10();
    let y = this.random0to10();
    while (!this.#computerBoard.isValidToHit(x, y)) {
      x = this.random0to10();
      y = this.random0to10();
    }

    return [x, y];
  }

  random0to10() {
    return Math.floor(Math.random() * 10);
  }
}

export default Player;