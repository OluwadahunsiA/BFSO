const reverse = require('../utils/testing').reverse;

test('reverse of a', () => {
  const result = reverse('a');

  expect(result).toBe('a');
});

test('reverse of react', () => {
  const result = reverse('react');

  expect(result).toBe('tcaer');
});

test('reverse of ananas', () => {
  const result = reverse('ananas');

  expect(result).toBe('sanana');
});

test('reverse of income', () => {
  const result = reverse('income');

  expect(result).toBe('emocni');
});
