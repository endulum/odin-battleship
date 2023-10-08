import Player from "./player";

let player;

describe('init', () => {
  beforeAll(() => {
    player = new Player();
  });

  test('nobody is hit yet', () => {
    expect(player.yourBoard.hitCoords.length).toBe(0);
    expect(player.opponentBoard.hitCoords.length).toBe(0);
  })

  test('computer placed all their ships, player has not yet', () => {
    expect(player.yourBoard.getAllOccupied().length).toBe(0);
    expect(player.opponentBoard.getAllOccupied().length).toBe(17);
  });

  test('player cannot place a hit until the game starts', () => {
    player.yourMove(3, 3);
    expect(player.yourBoard.hitCoords.length).toBe(0);

    player.makeRandomMove();
    expect(player.yourBoard.hitCoords.length).toBe(0);

    player.placeAllShipsRandomly();
    player.yourMove(3, 3);
    expect(player.yourBoard.hitCoords.length).toBe(1);
  });
});

describe('starting and playing the game', () => {
  beforeAll(() => {
    player = new Player();
  });

  test('placing all ships starts the game', () => {
    player.placeShip('Carrier', 0, 0, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShip('Battleship', 0, 1, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShip('Destroyer', 0, 2, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShip('Submarine', 0, 3, 'horizontal');
    expect(player.isGameRunning).toBe(false);

    player.placeShip('Patrol Boat', 0, 4, 'horizontal');
    expect(player.isGameRunning).toBe(true);
  });

  test('if player makes a hit, player gets a hit back', () => {
    player.yourMove(3, 3);
    expect(player.yourBoard.hitCoords.length).toBe(1);
    expect(player.opponentBoard.hitCoords).toEqual([[3, 3]]);
  });

  test('nothing happens if player hits somewhere out of bounds', () => {
    player.yourMove(10, 10);
    player.yourMove(-1, -1);
    expect(player.yourBoard.hitCoords.length).toBe(1);
    expect(player.opponentBoard.hitCoords).toEqual([[3, 3]]);
  });

  test('nothing happens if player hits the same space twice', () => {
    player.yourMove(3, 3);
    player.yourMove(3, 3);
    expect(player.yourBoard.hitCoords.length).toBe(1);
    expect(player.opponentBoard.hitCoords).toEqual([[3, 3]]);
  });

  test('can place a random valid hit and get hit back', () => {
    player.makeRandomMove();
    expect(player.yourBoard.hitCoords.length).toBe(2);
    expect(player.opponentBoard.hitCoords.length).toBe(2);
  })
});

describe('end of game', () => {
  beforeAll(() => {
    player = new Player();

    player.placeAllShipsRandomly();
    while (player.isGameRunning) {
      player.makeRandomMove();
    }
  });

  test('game can end, and has a definitive winner', () => {
    expect(['COMPUTER', 'PLAYER']).toContain(player.winner);
  });

  test('difference in hit amount between boards is no greater than 1', () => {
    const computerHits = player.opponentBoard.hitCoords.length;
    const playerHits = player.yourBoard.hitCoords.length;
    expect([0, 1]).toContain(Math.abs(computerHits - playerHits));
  });
});