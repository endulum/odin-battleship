import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Player from './modules/player/player';

const yourBoardDiv = document.getElementById('your-board');
const opponentBoardDiv = document.getElementById('opponent-board');

class Controller {
  #whoseTurn = undefined;
  get whoseTurn() { return this.#whoseTurn }

  #gameplay;
  get gameplay() { return this.#gameplay }

  constructor() {
    this.#gameplay = new Player();
    this.#gameplay.placeAllShipsRandomly();
    this.switchTurn();
    renderBoard(this.#gameplay.yourBoard, 'PLAYER', this.#whoseTurn);
    renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', this.#whoseTurn);
  }

  playRound(x, y) {
    this.#gameplay.yourMove(x, y);
    this.refreshBoards();
  }

  refreshBoards() {
    renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', this.#whoseTurn);
    if (!this.#gameplay.winner) {
      this.switchTurn();
      renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', this.#whoseTurn);
      setTimeout(() => {
        renderBoard(this.#gameplay.yourBoard, 'PLAYER', this.#whoseTurn);
        if (!this.#gameplay.winner) {
          this.switchTurn();
          renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', this.#whoseTurn);
        }
      }, 500);
    }
  }

  switchTurn() {
    if (this.#whoseTurn === undefined) {
      this.#whoseTurn = 'PLAYER';
      yourBoardDiv.style.opacity = 0.5;
      opponentBoardDiv.style.opacity = 1;
      return;
    }
    if (this.#whoseTurn === 'PLAYER') {
      this.#whoseTurn = 'OPPONENT';
      yourBoardDiv.style.opacity = 1;
      opponentBoardDiv.style.opacity = 0.5;
      return;
    }
    if (this.#whoseTurn === 'OPPONENT') {
      this.#whoseTurn = 'PLAYER';
      yourBoardDiv.style.opacity = 0.5;
      opponentBoardDiv.style.opacity = 1;
      return;
    }
  }
}

function renderBoard(boardData, whoseBoard, whoseTurn) {
  const board = document.createElement('div');
  board.classList.add('board');

  let parentDiv;
  if (whoseBoard === 'OPPONENT') {
    parentDiv = opponentBoardDiv;
  } else if (whoseBoard === 'PLAYER') {
    parentDiv = yourBoardDiv;
  }

  for (let y = 0; y < 10; y++) {
    const row = document.createElement('div');
    row.classList.add('row');
  
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
  
      cell.dataset.x = x;
      cell.dataset.y = y;

      let cellHTML = ``;

      if (
        whoseBoard === 'PLAYER' &&
        boardData.isOccupied(x, y) &&
        !boardData.isHit(x, y)
      ) {
        cellHTML += `<div class="fill-in ship">
          <i class="fa-solid fa-ship"></i>
        </div>`
      }

      if (
        !boardData.isOccupied(x, y) &&
        boardData.isHit(x, y)
      ) {
        cellHTML += `<div class="fill-in miss">
          <i class="fa-solid fa-water"></i>
        </div>`
      } else if (
        boardData.isOccupied(x, y) &&
        boardData.isHit(x, y)
      ) {
        cellHTML += `<div class="fill-in hit">
          <i class="fa-solid fa-burst"></i>
        </div>`
      }

      if (
        whoseBoard === 'OPPONENT' &&
        whoseTurn === 'PLAYER' && 
        !boardData.isAllSunk() &&
        boardData.isValidToHit(x, y)
      ) {
        cell.classList.add('can-hit');
        cell.addEventListener('click', () => {
          controller.playRound(x, y);
        })
      }

      cell.innerHTML = cellHTML;
      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  parentDiv.innerHTML = ``;
  parentDiv.appendChild(board);
}

const controller = new Controller();