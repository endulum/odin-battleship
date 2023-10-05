import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Board from './modules/board/board'

// const player = new Player();
// player.yourBoard.placeAllShipsRandomly();


const myBoard = new Board();
myBoard.placeAllShipsRandomly();
// for (let i = 0; i < 15; i++) myBoard.receiveRandomHit();

// document.body.appendChild(renderBoard(myBoard));

const myBoardDiv = document.createElement('div');
myBoardDiv.setAttribute('id', 'my-board');
document.body.appendChild(myBoardDiv);

renderBoard(myBoard);

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

      // if (
      //   boardData.isOccupied(x, y) &&
      //   !boardData.isHit(x, y)
      // ) {
      //   cellHTML += `<div class="fill-in ship">
      //     <i class="fa-solid fa-ship"></i>
      //   </div>`
      // } 
      
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

      if (boardData.isValidToHit(x, y)) {
        cell.classList.add('can-hit');
        cell.addEventListener('click', () => {
          boardData.receiveHit(x, y);
          renderBoard(boardData);
        })
      }

      cell.innerHTML = cellHTML;
      row.appendChild(cell);
    }
  
    board.appendChild(row);
  }

  //return board;
  myBoardDiv.innerHTML = ``;
  myBoardDiv.appendChild(board);
}

const board = document.createElement('div');
board.classList.add('board');