import Player from "./player";

let player;

describe('initialization', () => {
  beforeAll(() => {
    player = new Player();
  });

  test('both boards have all ships ready', () => {
    expect(player.yourBoard.ships.length).toBe(5);
    expect(player.opponentBoard.ships.length).toBe(5);
    expect(Object.keys(player.yourBoard.shipCoordinates).length).toBe(5);
    expect(Object.keys(player.opponentBoard.shipCoordinates).length).toBe(5);
  });

  test('nobody is hit yet', () => {
    expect(player.yourBoard.receivedHits.length).toBe(0);
    expect(player.opponentBoard.receivedHits.length).toBe(0);
  })

  test('computer placed all their ships, player has not yet', () => {
    expect(player.yourBoard.getOccupied().length).toBe(0);
    expect(player.opponentBoard.getOccupied().length).toBeGreaterThan(0);
  });

  test('player cannot place a hit until the game starts', () => {
    player.yourMove(3, 3);
    expect(player.yourBoard.receivedHits.length).toBe(0);

    player.makeRandomMove();
    expect(player.yourBoard.receivedHits.length).toBe(0);

    player.placeAllShipsRandomly();
    player.yourMove(3, 3);
    expect(player.yourBoard.receivedHits.length).toBe(1);
  });
});

describe('starting and playing the game', () => {
  beforeAll(() => {
    player = new Player();
  });

  test('placing all ships starts the game', () => {
    player.placeShipByName('Carrier', 0, 0, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShipByName('Battleship', 0, 1, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShipByName('Destroyer', 0, 2, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShipByName('Submarine', 0, 3, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShipByName('Patrol Boat', 0, 4, 'horizontal');
    expect(player.isGameRunning).toBe(true);
  });

  test('if player makes a hit, player gets a hit back', () => {
    player.yourMove(3, 3);
    //player.yourBoard.print();
    //player.opponentBoard.print();
    expect(player.yourBoard.receivedHits.length).toBe(1);
    expect(player.opponentBoard.receivedHits.length).toBe(1);
  });

  test('nothing happens if player hits the same space twice', () => {
    player.yourMove(3, 3);
    player.yourMove(3, 3);
    //player.yourBoard.print();
    //player.opponentBoard.print();
    expect(player.yourBoard.receivedHits.length).toBe(1);
    expect(player.opponentBoard.receivedHits.length).toBe(1);
  })
});

describe('end of game', () => {
  beforeAll(() => {
    player = new Player();

    player.placeAllShipsRandomly();
    while (player.isGameRunning) {
      player.makeRandomMove();
    }

    player.yourBoard.print();
    player.opponentBoard.print();
  });

  test('game can end, and has a definitive winner', () => {
    expect(['COMPUTER', 'PLAYER']).toContain(player.winner);
  });

  test('difference in hit amount between boards is no greater than 1', () => {
    const computerHits = player.opponentBoard.receivedHits.length;
    const playerHits = player.yourBoard.receivedHits.length;
    expect([0, 1]).toContain(Math.abs(computerHits - playerHits));
  });
});