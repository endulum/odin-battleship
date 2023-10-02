import Board from './board';
import Ship from '../ship/ship';

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
      expect(board.ships.map(ship => [ship.name, ship.length, ship.hits])).toEqual([
        ['Carrier', 5, 0],
        ['Battleship', 4, 0],
        ['Destroyer', 3, 0],
        ['Submarine', 3, 0],
        ['Patrol Boat', 2, 0]
      ]); 
    });

    test('able to place a ship horizontally', () => {
      expect(board.placeShip(1, 0, new Ship('Destroyer', 3))).toEqual([[1, 0], [2, 0], [3, 0]]);
    });

    test('able to place a ship vertically', () => {
      expect(board.placeShip(0, 1, new Ship('Destroyer', 3), 'vertical')).toEqual([[0, 1], [0, 2], [0, 3]]);
    });

    test('not able to place a ship out of bounds', () => {
      expect(board.placeShip(8, 8, new Ship('Destroyer', 3))).toEqual([]);
    });

    test('when randomly placing ships, amount of occupied cells is exactly 17', () => {
      board.randomlyPlaceShips();
      //board.print();
      expect(Object.keys(board.occupiedCells).reduce((acc, curr) => acc + board.occupiedCells[curr].length, 0)).toBe(17);
    });
  });

  describe('board hit behavior', () => {
    test('receive one hit at 3, 3', () => {
      board.receiveHit(3, 3);
      //board.print();
      expect(board.hitCells).toEqual([[3, 3]]);
    });

    test('properly receive 10 random hits', () => {
      for (let i = 0; i < 10; i++) {
        board.receiveRandomHit();
      }
      board.print();
      expect(board.hitCells.length).toBe(11);
    })
  })
});