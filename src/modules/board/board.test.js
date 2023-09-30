const Board = require('./board');

describe('board functions', () => {
  let board;

  beforeAll(() => { board = new Board() });

  describe('cell behavior', () => {
    test('has ten rows and 100 cells total', () => {
      //board.print();
      expect(board.cells.length).toBe(10);
      expect(board.cells.reduce((acc, curr) => acc + curr.length, 0)).toBe(100);
    });

    test('can change a cell', () => {
      board.changeCell(3, 3, 'hit');
      //board.print();
      expect(board.cells.some(row => row.includes('hit'))).toBe(true);
    });
  });
});