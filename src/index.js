import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Board from './modules/board/board'
import Player from './modules/player/player'

let whoseTurn = 'OPPONENT';

const yourBoardDiv = document.getElementById('your-board');
const opponentBoardDiv = document.getElementById('opponent-board');

const gameplay = new Player();
gameplay.placeAllShipsRandomly();

function playRound(x, y) {
  gameplay.yourMove(x, y);
  renderBoard(opponentBoardDiv, gameplay.opponentBoard);

  if (gameplay.isGameRunning) {
    opponentBoardDiv.classList.add('inactive');
    yourBoardDiv.classList.remove('inactive');
    whoseTurn = 'OPPONENT';

    setTimeout(() => {
      renderBoard(yourBoardDiv, gameplay.yourBoard);
      opponentBoardDiv.classList.remove('inactive');
      yourBoardDiv.classList.add('inactive');
      whoseTurn = 'PLAYER';
    }, 500);
  }
}

renderBoard(yourBoardDiv, gameplay.yourBoard);
yourBoardDiv.classList.add('inactive');
whoseTurn = 'PLAYER';
renderBoard(opponentBoardDiv, gameplay.opponentBoard);

function renderBoard(parentDiv, boardData) {
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
        whoseTurn === 'OPPONENT' &&
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
        gameplay.isGameRunning &&
        whoseTurn === 'PLAYER' && 
        boardData.isValidToHit(x, y)) {
        cell.classList.add('can-hit');
        cell.addEventListener('click', () => {
          playRound(x, y);
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
