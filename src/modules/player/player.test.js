import Player from "./player";

let player;

describe('initialization', () => {
  beforeAll(() => {
    player = new Player(false);
  });

  test('both boards have all ships ready', () => {
    expect(Object.keys(player.yourBoard.shipCoordinates).length).toBe(5);
    expect(Object.keys(player.computerBoard.shipCoordinates).length).toBe(5);
  });

  test('computer placed all their ships, player has not', () => {
    expect(player.yourBoard.getOccupied().length).toBe(0);
    expect(player.computerBoard.getOccupied().length).toBeGreaterThan(0);
  })
});

describe('cpu versus cpu', () => {
  beforeAll(() => {
    player = new Player(true);
  });
  // by the time construction has ended there is already a winner

  test('there is a definite winner', () => {
    expect(player.winner).toBeTruthy();
  })

  test('difference in hit amount between boards is no greater than 1', () => {
    player.yourBoard.print();
    player.computerBoard.print();
    const computerHits = player.computerBoard.receivedHits.length;
    const playerHits = player.yourBoard.receivedHits.length;
    expect([0, 1]).toContain(Math.abs(computerHits - playerHits));
  });
})