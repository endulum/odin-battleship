import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Player from './modules/player/player';
import isCoordInBounds from './modules/helpers/isInBounds';


function Controller() {
  const gameplay = new Player();

  view.renderBoard(gameplay.yourBoard, 'PLAYER', undefined);
  view.renderBoard(gameplay.opponentBoard, 'OPPONENT', undefined);
  view.dimOpponentBoard();
  view.updateHeader('placing ships');

  function placeShip(shipName, x, y, orientation) {
    gameplay.placeShip(shipName, x, y, orientation);
    if (gameplay.isGameRunning) {
      startGame();
    } else {
      view.renderBoard(gameplay.yourBoard, 'PLAYER', undefined);
    }
  }

  function startGame() {
    view.renderBoard(gameplay.yourBoard, 'PLAYER', 'PLAYER');
    view.renderBoard(gameplay.opponentBoard, 'OPPONENT', 'PLAYER');
    view.updateHeader('player turn');
    view.dimYourBoard();
  }

  function refreshBoards() {
    view.renderBoard(gameplay.opponentBoard, 'OPPONENT', 'OPPONENT');
    if (gameplay.winner === 'PLAYER') {
      view.updateHeader('player win');
      return;
    }

    view.updateHeader('opponent turn');
    view.dimOpponentBoard();
    setTimeout(() => {
      view.renderBoard(gameplay.yourBoard, 'PLAYER', 'OPPONENT');
      if (gameplay.winner === 'OPPONENT') {
        view.updateHeader('opponent win');
        return;
      }

      view.updateHeader('player turn');
      view.renderBoard(gameplay.opponentBoard, 'OPPONENT', 'PLAYER');
      view.dimYourBoard();
    }, 500)
  }

  function playRound(x, y) {
    gameplay.yourMove(x, y);
    refreshBoards();
  }

  return { playRound, placeShip, refreshBoards }
}

function View() {
  const yourBoardDiv = document.getElementById('your-board');
  const opponentBoardDiv = document.getElementById('opponent-board');
  const headerDiv = document.querySelector('header');

  function renderBoard(boardData, whoseBoard, whoseTurn) {
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

        cellHTML += y === 0 ? `<div class="x-indicator">${x}</div>` : ``;
        cellHTML += x === 0 ? `<div class="y-indicator">${y}</div>` : ``;
        
        cellHTML += (
          whoseBoard === 'PLAYER' &&
          boardData.isCoordOccupied(x, y) &&
          !boardData.isCoordHit(x, y)
        ) ? `<div class="fill-in ship">
          <i class="fa-solid fa-ship"></i>
        </div>` : ``;

        cellHTML += (
          !boardData.isCoordOccupied(x, y) &&
          boardData.isCoordHit(x, y)
        ) ? `<div class="fill-in miss">
          <i class="fa-solid fa-water"></i>
        </div>` : ``;

        cellHTML += (
          boardData.isCoordOccupied(x, y) &&
          boardData.isCoordHit(x, y)
        ) ? `<div class="fill-in hit">
          <i class="fa-solid fa-burst"></i>
        </div>` : ``;

        if (
          whoseBoard === 'OPPONENT' &&
          whoseTurn === 'PLAYER' && 
          !boardData.isAllSunk() &&
          boardData.isValidToHit(x, y)
        ) ableToPlaceHits(cell);

        cell.innerHTML = cellHTML;
        row.appendChild(cell);
      }

      board.appendChild(row);
    }

    if (whoseBoard === 'OPPONENT') {
      opponentBoardDiv.innerHTML = ``;
      opponentBoardDiv.appendChild(board);
      opponentBoardDiv.appendChild(getStatus(boardData, whoseBoard));
    } else if (whoseBoard === 'PLAYER') {
      yourBoardDiv.innerHTML = ``;
      yourBoardDiv.appendChild(board);
      yourBoardDiv.appendChild(getStatus(boardData, whoseBoard));
    }

    if (
      whoseBoard === 'PLAYER' &&
      whoseTurn === undefined
    ) {
      let orientation = 'horizontal'
      ableToPlaceShips(boardData, orientation);
      board.addEventListener('contextmenu', event => {
        event.preventDefault();
        if (orientation === 'horizontal') {
          ableToPlaceShips(boardData, 'vertical');
          orientation = 'vertical';
        } else if (orientation === 'vertical') {
          ableToPlaceShips(boardData, 'horizontal');
          orientation = 'horizontal';
        }
      });
    }

  }

  function ableToPlaceHits(cell) {
    cell.addEventListener('mouseover', () => {
      cell.classList.add('action');
    });

    cell.addEventListener('mouseleave', () => {
      cell.classList.remove('action');
    })
    
    cell.addEventListener('click', () => {
      controller.playRound(
        parseInt(cell.dataset.x), 
        parseInt(cell.dataset.y)
      );
    });
  }

  function ableToPlaceShips(boardData, orientation) {
    const unplacedShip = boardData.getShipByName(
      boardData.getFirstUnplacedShip()
    );

    const cells = getCells();

    if (orientation === 'horizontal') {
      cells.forEach(cell => {
        const clone = cell.cloneNode(true);
        clone.classList.remove('action');

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (isCoordInBounds(x + unplacedShip.length - 1, y)) {
          clone.addEventListener('mouseover', () => {
            for (let i = x; i < x + unplacedShip.length; i++) {
              getCellByCoord(i, y).classList.add('action');
            }
          });

          clone.addEventListener('mouseleave', () => {
            for (let i = x; i < x + unplacedShip.length; i++) {
              getCellByCoord(i, y).classList.remove('action');
            }
          });

          clone.addEventListener('click' , () => {
            controller.placeShip(unplacedShip.name, x, y, 'horizontal');
          });
        }

        cell.replaceWith(clone);
      })
    }

    if (orientation === 'vertical') {
      cells.forEach(cell => {
        const clone = cell.cloneNode(true);
        clone.classList.remove('action');

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (isCoordInBounds(x, y + unplacedShip.length - 1)) {
          clone.addEventListener('mouseover', () => {
            for (let i = y; i < y + unplacedShip.length; i++) {
              getCellByCoord(x, i).classList.add('action');
            }
          });

          clone.addEventListener('mouseleave', () => {
            for (let i = y; i < y + unplacedShip.length; i++) {
              getCellByCoord(x, i).classList.remove('action');
            }
          });

          clone.addEventListener('click' , () => {
            controller.placeShip(unplacedShip.name, x, y, 'vertical');
          });
        }

        cell.replaceWith(clone);
      })
    }
  }

  function getCellByCoord(x, y) {
    return getCells().find(cell => {
      return (
        parseInt(cell.dataset.x) === x &&
        parseInt(cell.dataset.y) === y
      )
    })
  }

  function getCells() {
    return Array.from(document.querySelectorAll('.cell'));
  }

  function dimYourBoard() {
    yourBoardDiv.style.opacity = 0.5;
    opponentBoardDiv.style.opacity = 1;
  }
  
  function dimOpponentBoard() {
    yourBoardDiv.style.opacity = 1;
    opponentBoardDiv.style.opacity = 0.5;
  }

  function updateHeader(statusText) {
    switch(statusText) {
      case 'player turn':
        headerDiv.innerHTML = `<h1>It's your turn.</h1>
          <h2>Click on one of your opponent's cells to launch an attack.</h2>`;
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
      case 'placing ships':
        headerDiv.innerHTML = `<h1>Welcome to Battleship</h1>
          <h2>Place all your ships to start. Right-click to rotate the ship.</h2>`;
        break;
    }
  }

  function getStatus(boardData, whoseBoard) {
    const status = document.createElement('div');
    status.classList.add('status');
    
    let statusHTML = `<h3>${whoseBoard === 'PLAYER' ? 
      "Your Board" : 
      "Computer's Board"}
    </h3>`;

    boardData.ships.forEach(ship => {
      statusHTML += `<p>${ship.name}: 
        ${boardData.shipCoords[ship.name].length === 0 ?
          "<b>Unplaced</b>" :
          ship.isSunk() ? 
            "<span class='text-sunk'>Sunk</span>" : 
            "<span class='text-afloat'>Afloat</span>"}
      </p>`;
    });

    status.innerHTML = statusHTML;
    return status;
  }

  return { renderBoard, dimOpponentBoard, dimYourBoard, updateHeader }
}

const view = new View();
const controller = new Controller();






