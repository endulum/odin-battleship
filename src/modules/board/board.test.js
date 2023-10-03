import Board from './board';

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

describe('attack behavior', () => {
  beforeEach(() => board.clearShips());

  test('hit a Destroyer once', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    board.receiveHit(3, 3);
    expect(board.getShipByName('Destroyer').hits).toBe(1);
    expect(board.getShipByName('Destroyer').isSunk()).toBe(false);
  });

  test('cannot hit a Destroyer more than once in the same spot', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    board.receiveHit(3, 3);
    board.receiveHit(3, 3);
    board.receiveHit(3, 3);
    expect(board.getShipByName('Destroyer').hits).toBe(1);
    expect(board.getShipByName('Destroyer').isSunk()).toBe(false);
  });

  test('sink a Destroyer', () => {
    board.placeShipByName('Destroyer', 3, 3, 'vertical');
    board.receiveHit(3, 3);
    board.receiveHit(3, 4);
    board.receiveHit(3, 5);
    expect(board.getShipByName('Destroyer').hits).toBe(3);
    expect(board.getShipByName('Destroyer').isSunk()).toBe(true);
  });

  test('sink every ship', () => {
    board.placeAllShipsRandomly();
    expect(board.isAllSunk()).toBe(false);

    const coordsToHit = board.getOccupied();
    coordsToHit.forEach(coord => board.receiveHit(coord[0], coord[1]));

    expect(board.getShipByName('Carrier').hits).toBe(5);
    expect(board.getShipByName('Carrier').isSunk()).toBe(true);

    expect(board.getShipByName('Battleship').hits).toBe(4);
    expect(board.getShipByName('Battleship').isSunk()).toBe(true);

    expect(board.getShipByName('Destroyer').hits).toBe(3);
    expect(board.getShipByName('Destroyer').isSunk()).toBe(true);

    expect(board.getShipByName('Submarine').hits).toBe(3);
    expect(board.getShipByName('Submarine').isSunk()).toBe(true);

    expect(board.getShipByName('Patrol Boat').hits).toBe(2);
    expect(board.getShipByName('Patrol Boat').isSunk()).toBe(true);

    expect(board.isAllSunk()).toBe(true);
  })
});