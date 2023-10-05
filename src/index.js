import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Player from './modules/player/player';

const player = new Player();
player.yourBoard.placeAllShipsRandomly();
for (let i = 0; i < 15; i++) player.yourBoard.receiveRandomHit();

document.body.appendChild(renderBoard(player.yourBoard));

function renderBoard(boardData) {
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
        boardData.isOccupied(x, y) &&
        !boardData.isHit(x, y)
      ) {
        cellHTML += `<div class="fill-in ship">
          <i class="fa-solid fa-ship"></i>
        </div>`
      } else if (
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

      cell.innerHTML = cellHTML;
      row.appendChild(cell);
    }
  
    board.appendChild(row);
  }

  return board;
}

const board = document.createElement('div');
board.classList.add('board');