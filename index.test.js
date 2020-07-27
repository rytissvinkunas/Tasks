/* eslint-disable no-undef */
const roundFee = require('./index');
// const inputFileName = require('./index');

test('Rounds number to up and to 2 decimal places', () => {
  expect(roundFee(5.211)).toBe('5.22');
});

// test('returns file name', () => {
//   const inputFile = 'data2.json';
//   expect(inputFileName()).toBe('data2.json');
// });
