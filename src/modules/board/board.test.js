const Board = require('./board');
const Ship = require('../ship/ship.js')

describe('board functions', () => {
  let board;

  beforeAll(() => { board = new Board() });

  describe('cell behavior', () => {
    test('has ten rows and 100 cells total', () => {
      expect(board.cells.length).toBe(10);
      expect(board.cells.reduce((acc, curr) => acc + curr.length, 0)).toBe(100);
    });

    test('can change a cell', () => {
      board.changeCell(3, 3, 'hit');
      expect(board.cells.some(row => row.includes('hit'))).toBe(true);
    });
  });

  describe('ship behavior', () => {
    test('initialized with all new ships', () => {
      // console.log(board.occupiedCells);
      // board.print();
      expect(board.ships.map(ship => [ship.name, ship.length, ship.hits])).toEqual([
        ['Carrier', 5, 0],
        ['Battleship', 4, 0],
        ['Destroyer', 3, 0],
        ['Submarine', 3, 0],
        ['Patrol Boat', 2, 0]
      ]); 
    });

    test('can place a ship horizontally', () => {
      expect(board.placeShip(3, 3, new Ship('Destroyer', 3))).toEqual([[3, 3], [4, 3], [5, 3]]);
    });

    test('can place a ship vertically', () => {
      expect(board.placeShip(3, 3, new Ship('Destroyer', 3), 'vertical')).toEqual([[3, 3], [3, 4], [3, 5]]);
    });

    test('prevented from placing a ship out of bounds', () => {
      expect(board.placeShip(8, 8, new Ship('Destroyer', 3))).toEqual([]);
    });
  })
});