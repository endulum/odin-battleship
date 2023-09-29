const Board = require('./board');

describe('board functions', () => {
  let board;

  beforeAll(() => { board = new Board() });

  describe('board initialization', () => {
    test('has ten rows and 100 cells total', () => {
      expect(board.cells.length).toBe(10);
      expect(board.cells.reduce((acc, curr) => acc + curr.length, 0)).toBe(100);
    })
  })
})