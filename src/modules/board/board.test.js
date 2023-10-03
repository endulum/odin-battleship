import Board from './board';
// import Ship from '../ship/ship';

let board;
beforeEach(() => { board = new Board() });

describe('hit behavior', () => {
  beforeEach(() => { board.clearHits() });

  test('can place a hit', () => {
    board.receiveHit(3, 3);
    expect(board.receivedHits).toEqual([[3, 3]]);
  });

  test('can place multiple hits', () => {
    board.receiveHit(4, 4);
    board.receiveHit(5, 5);
    board.receiveHit(6, 6);
    expect(board.receivedHits).toEqual([[4, 4], [5, 5], [6, 6]]);
  });

  test('cannot place hits out of bounds', () => {
    board.receiveHit(10, 10);
    board.receiveHit(-1, -1);
    expect(board.receivedHits).toEqual([]);
  });

  test('cannot place more than one hit in the same cell', () => {
    board.receiveHit(1, 1);
    board.receiveHit(2, 2);
    board.receiveHit(1, 1);
    expect(board.receivedHits).toEqual([[1, 1], [2, 2]]);
  });

  test('can place a hit at random', () => {
    board.receiveRandomHit();
    expect(board.receivedHits.length).toBe(1);
  });

  test('can place ten different hits at random', () => {
    for (let i = 0; i < 10; i++) {
      board.receiveRandomHit();
    }
    expect(board.receivedHits.length).toBe(10);
  });
});

describe('ship placement', () => {
  beforeEach(() => board.clearShips());

  test('initializes with all unplaced ships', () => {
    expect(board.ships.length).toBe(5);
    expect(Object.keys(board.shipCoordinates).length).toBe(5);
  });

  test('can place a Destroyer vertically', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    expect(board.shipCoordinates['Destroyer']).toEqual([[3, 3], [3, 4], [3, 5]]);
  });

  test('can place a Submarine horizontally', () => {
    board.placeShipByName('Submarine', 3, 3, 'horizontal');
    expect(board.shipCoordinates['Submarine']).toEqual([[3, 3], [4, 3], [5, 3]]);
  });

  test('cannot place a ship out of bounds', () => {
    board.placeShipByName('Submarine', -1, -1, 'horizontal');
    expect(board.shipCoordinates['Submarine']).toEqual([]);
  })

  test('cannot overlap ships', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    board.placeShipByName('Submarine', 3, 3, 'horizontal');
    expect(board.shipCoordinates['Destroyer']).toEqual([[3, 3], [3, 4], [3, 5]]);
  });

  test('cannot place the same ship twice', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    board.placeShipByName('Destroyer', 4, 4, 'vertical');
    expect(board.shipCoordinates['Destroyer']).toEqual([[3, 3], [3, 4], [3, 5]]);
  })

  test('can randomly place all ships', () => {
    board.placeAllShipsRandomly();
    expect(Object.keys(board.shipCoordinates).length).toBe(5);
    expect(board.getOccupied().length).toBe(17);
  });
})