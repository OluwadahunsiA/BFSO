const average = require('../utils/testing').average;

describe('average', () => {
  test('get the average of 3 and 5', () => {
    const result = average([3, 5]);

    expect(result).toBe(4);
  });

  test('get the average of an array containing 4 and -4', () => {
    const result = average([4, -4]);

    expect(result).toBe(0);
  });

  test('the average of an empty array', () => {
    const result = average([]);

    expect(result).toBe(0);
  });
});
