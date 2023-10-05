import './styles/base.css';
import './styles/board.css';
import '@fortawesome/fontawesome-free/js/all.js';

const board = document.createElement('div');
board.classList.add('board');
document.body.appendChild(board);

for (let y = 0; y < 10; y++) {
  const row = document.createElement('div');
  row.classList.add('row');

  for (let x = 0; x < 10; x++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    cell.dataset.x = x;
    cell.dataset.y = y;

    if (y === 0) {
      const indicator = document.createElement('div');
      indicator.classList.add('x-indicator');
      indicator.textContent = x;
      cell.appendChild(indicator);
    }

    if (x === 0) {
      const indicator = document.createElement('div');
      indicator.classList.add('y-indicator');
      indicator.textContent = y;
      cell.appendChild(indicator);
    }

    row.appendChild(cell);
  }

  board.appendChild(row);
}

const cells = document.querySelectorAll('.cell');

const ship = document.createElement('div');
ship.classList.add('fill-in');
ship.classList.add('ship');
ship.innerHTML = `<i class="fa-solid fa-ship"></i>`;
cells[0].appendChild(ship);

const hit = document.createElement('div');
hit.classList.add('fill-in');
hit.classList.add('hit');
hit.innerHTML = `<i class="fa-solid fa-burst"></i>`;
cells[1].appendChild(hit);

const miss = document.createElement('div');
miss.classList.add('fill-in');
miss.classList.add('miss');
miss.innerHTML = `<i class="fa-solid fa-water"></i>`;
cells[2].appendChild(miss);