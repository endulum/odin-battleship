import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Player from './modules/player/player';

const yourBoardDiv = document.getElementById('your-board');
const opponentBoardDiv = document.getElementById('opponent-board');

class Controller {
  #gameplay;
  get gameplay() { return this.#gameplay }

  constructor() {
    this.#gameplay = new Player();
    this.#gameplay.placeAllShipsRandomly();
    renderBoard(this.#gameplay.yourBoard, 'PLAYER', 'PLAYER');
    renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', 'PLAYER');
    updateHeader('player turn');
    this.dimYourBoard();
  }

  playRound(x, y) {
    this.#gameplay.yourMove(x, y);
    this.refreshBoards();
  }

  dimYourBoard() {
    yourBoardDiv.style.opacity = 0.5;
    opponentBoardDiv.style.opacity = 1;
  }

  dimOpponentBoard() {
    yourBoardDiv.style.opacity = 1;
    opponentBoardDiv.style.opacity = 0.5;
  }

  refreshBoards() {
    renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', 'OPPONENT');

    if (this.#gameplay.winner === 'PLAYER') {
      updateHeader('player win');
      return;
    }

    updateHeader('opponent turn');
    this.dimOpponentBoard();
    setTimeout(() => {
      renderBoard(this.#gameplay.yourBoard, 'PLAYER', 'OPPONENT');

      if (this.#gameplay.winner === 'COMPUTER') {
        updateHeader('opponent win');
        return;
      }

      updateHeader('player turn');
      renderBoard(this.#gameplay.opponentBoard, 'OPPONENT', 'PLAYER');
      this.dimYourBoard();
    }, 750);
  }
}

function renderBoard(boardData, whoseBoard, whoseTurn) {
  
  let parentDiv;
  if (whoseBoard === 'OPPONENT') {
    parentDiv = opponentBoardDiv;
  } else if (whoseBoard === 'PLAYER') {
    parentDiv = yourBoardDiv;
  }

  const board = document.createElement('div');
  board.classList.add('board');

  for (let y = 0; y < 10; y++) {
    const row = document.createElement('div');
    row.classList.add('row');
  
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
  
      cell.dataset.x = x;
      cell.dataset.y = y;

      let cellHTML = ``;

      if (y === 0) {
        cellHTML += `<div class="x-indicator">${x}</div>`
      }
  
      if (x === 0) {
        cellHTML += `<div class="y-indicator">${y}</div>`
      }

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

  const status = document.createElement('div');
  status.classList.add('status');
  let statusHTML = `<h3>${whoseBoard === 'PLAYER' ? 
    "Your Board" : 
    "Computer's Board"}
  </h3>`;

  boardData.ships.forEach(ship => {
    statusHTML += `<p>
      ${ship.name}: 
      ${ship.isSunk() ? 
        "<span class='text-sunk'>Sunk</span>" : 
        "<span class='text-afloat'>Afloat</span>"}
    </p>`;
  });

  status.innerHTML = statusHTML;

  parentDiv.innerHTML = ``;
  parentDiv.appendChild(board);
  parentDiv.appendChild(status);
}

function updateHeader(statusText) {
  const headerDiv = document.querySelector('header');

  switch(statusText) {
    case 'player turn':
      headerDiv.innerHTML = `<h1>It's your turn.</h1>
        <h2>Click on a cell to launch an attack.</h2>`;
      break;
    case 'opponent turn':
      headerDiv.innerHTML = `<h1>It's your opponent's turn.</h1>
        <h2>The computer is thinking...</h2>`;
      break;
    case 'player win':
      headerDiv.innerHTML = `<h1>You won!</h1>
        <h2>You sunk all your opponent's ships!</h2>`;
      break;
    case 'opponent win':
      headerDiv.innerHTML = `<h1>You lost!</h1>
        <h2>Your opponent sunk all your ships!</h2>`;
      break;
  }

  // if (
  //   whoseBoard === 'OPPONENT' &&
  //   whoseTurn === 'PLAYER'
  // ) {
    // headerDiv.innerHTML = `<h1>It's your turn.</h1>
    //   <h2>Click on a cell to launch an attack.</h2>`;
  // }

  // if (
  //   whoseBoard === 'PLAYER' &&
  //   whoseTurn === 'OPPONENT'
  // ) {
    // headerDiv.innerHTML = `<h1>It's your opponent's turn.</h1>
    //   <h2>The computer is thinking...</h2>`;
  // }
}

const controller = new Controller();