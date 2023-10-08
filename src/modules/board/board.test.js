import Board from './board';

let board;

describe('init', () => {
  beforeEach(() => { 
    board = new Board(); 
  });

  test('has five ship objects', () => {
    expect(board.ships.length).toBe(5);
    expect(board.ships.every(ship => typeof ship === 'object')).toBeTruthy();
  });

  test('ships are not yet placed', () => {
    expect(board.getFirstUnplacedShip()).toBeTruthy();
  });

  // test('receiving a hit before ship placement does nothing', () => {
  //   board.receiveHit(3, 3);
  //   expect(board.hitCoords).toEqual([])
  // });
});

describe('ship behavior', () => {
  beforeEach(() => { 
    board = new Board(); 
  });

  test('can place a ship horizontally', () => {
    board.placeShip('Destroyer', 3, 3, 'horizontal');
    expect(board.shipCoords['Destroyer']).toEqual([[3, 3], [4, 3], [5, 3]]);
  });

  test('can place a ship vertically', () => {
    board.placeShip('Destroyer', 3, 3, 'vertical');
    expect(board.shipCoords['Destroyer']).toEqual([[3, 3], [3, 4], [3, 5]]);
  });

  test('nothing happens when ship is placed over another ship', () => {
    board.placeShip('Destroyer', 3, 3, 'horizontal');
    board.placeShip('Submarine', 4, 3, 'horizontal');
    expect(board.shipCoords['Destroyer']).toEqual([[3, 3], [4, 3], [5, 3]]);
    expect(board.shipCoords['Submarine']).toEqual([]);
  });

  test('nothing happens when ship is placed twice', () => {
    board.placeShip('Destroyer', 3, 3, 'horizontal');
    board.placeShip('Destroyer', 4, 3, 'horizontal');
    expect(board.shipCoords['Destroyer']).toEqual([[3, 3], [4, 3], [5, 3]]);
  });

  test('nothing happens when ship is placed out of bounds', () => {
    board.placeShip('Destroyer', -1, -1, 'horizontal');
    board.placeShip('Destroyer', 10, 10, 'horizontal');
    expect(board.shipCoords['Destroyer']).toEqual([]);
  });

  test('can place all ships randomly', () => {
    board.placeAllShipsRandomly();
    expect(board.getAllOccupied().length).toBe(17);
  });
});

describe('hit behavior', () => {
  beforeEach(() => { 
    board = new Board(); 
  });

  test('can place a hit', () => {
    board.receiveHit(3, 3);
    expect(board.hitCoords).toEqual([[3, 3]]);
  });

  test('nothing happens when same cell is hit twice', () => {
    board.receiveHit(3, 3);
    board.receiveHit(3, 3);
    expect(board.hitCoords).toEqual([[3, 3]]);
  });

  test('nothing happens when hit is out of bounds', () => {
    board.receiveHit(10, 10);
    board.receiveHit(-1, -1);
    expect(board.hitCoords).toEqual([]);
  });

  test('can damage a ship with a hit', () => {
    board.placeShip('Destroyer', 3, 3, 'horizontal');
    board.receiveHit(3, 3);
    expect(board.getShipByName('Destroyer').hits).toBe(1);
    expect(board.getShipByName('Destroyer').isSunk()).toBeFalsy;
  });

  test('can sink a ship with enough hits', () => {
    board.placeShip('Destroyer', 3, 3, 'horizontal');
    board.receiveHit(3, 3);
    board.receiveHit(4, 3);
    board.receiveHit(5, 3);
    expect(board.getShipByName('Destroyer').hits).toBe(3);
    expect(board.getShipByName('Destroyer').isSunk()).toBeTruthy;
  });

  test('can place valid random hits', () => {
    for (let i = 0; i < 10; i++) {
      board.receiveRandomHit();
    }
    expect(board.hitCoords.length).toBe(10);
  });
});

describe('sink behavior', () => {
  beforeAll(() => { 
    board = new Board(); 
  });

  test('can properly report whether all ships have sunk', () => {
    [
      ['Carrier', 0],
      ['Battleship', 1],
      ['Destroyer', 2],
      ['Submarine', 3],
      ['Patrol Boat', 4]
    ].forEach(ship => {
      board.placeShip(ship[0], 0, ship[1], 'horizontal');
      expect(board.isAllSunk()).toBeFalsy;
    });

    board.getAllOccupied().forEach(cell => {
      board.receiveHit(cell[0], cell[1]);
    });

    expect(board.hitCoords.length).toBe(17);
    expect(board.isAllSunk()).toBeTruthy;
  });

  test('no more hits can be placed after all ships sunk', () => {
    board.receiveHit(5, 5);
    expect(board.hitCoords.length).toBe(17);
    expect(board.isAllSunk()).toBeTruthy;
  })
});