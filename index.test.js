/* eslint-disable no-undef */
const roundFee = require('./index');

test('Rounds number to up and to 2 decimal places', () => {
  expect(roundFee(5.211)).toBe('5.22');
});
