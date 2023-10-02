import Ship from './ship';

describe('ship functions - destroyer', () => {
  let ship;

  beforeAll(() => { ship = new Ship('Destroyer', 3) });

  describe('ship initialization', () => {
    test('has its given name', () => { expect(ship.name).toBe('Destroyer') });
    test('has its given length', () => { expect(ship.length).toBe(3) });
    test('has no hits', () => { expect(ship.hits).toBe(0) });
    test('is not sunk', () => { expect(ship.isSunk()).toBe(false) });
  })

  // describe('privacy of fields', () => {
  //   test('name cannot be changed', () => {
  //     console.log(ship.name = 'Carrier');
  //     expect(ship.name).toBe('Destroyer');
  //   });

  //   test('length cannot be changed', () => {
  //     ship.length = 69;
  //     expect(ship.length).toBe(3);
  //   });

  //   test('hits cannot be changed', () => {
  //     ship.hits = 69;
  //     expect(ship.hits).toBe(0);
  //   });
  // })

  describe('incrementing hits', () => {
    beforeEach(() => {
      ship.hit();
    });

    test('has 1 hit', () => { 
      expect(ship.hits).toBe(1);
      expect(ship.isSunk()).toBe(false);
    });

    test('has 2 hits', () => { 
      expect(ship.hits).toBe(2);
      expect(ship.isSunk()).toBe(false);
    });

    test('has 3 hits and is sunk', () => { 
      expect(ship.hits).toBe(3);
      expect(ship.isSunk()).toBe(true);
    });

    test('does not exceed 3 hits', () => { 
      expect(ship.hits).toBe(3);
      expect(ship.isSunk()).toBe(true);
    });
  });
});