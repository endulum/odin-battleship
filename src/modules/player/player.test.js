import Player from "./player";

let player;
beforeEach(() => { player = new Player() });

describe('init behavior', () => {
  test('initializes properly with both boards', () => {
    expect(player.yourBoard.ships.length).toBe(5);
    player.yourBoard.print();
    expect(player.computerBoard.ships.length).toBe(5);
    player.computerBoard.print();
  });
})