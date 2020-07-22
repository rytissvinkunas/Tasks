const fs = require('fs');
const currentWeekNumber = require('current-week-number');
// const axios = require('axios');
const fetch = require('node-fetch');

const inputFile = process.argv.slice(2);
// const cashInConfigUrl =
//   'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in';

function inputFileName() {
  if (inputFile) {
    return inputFile.toString();
  }
  return false;
}

function inputData(fileName) {
  try {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
  } catch (err) {
    return false;
  }
}

function getConfigData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // works and consols data
      return data; // returns undefined
    })
    .catch((error) => {
      console.error(error);
    });
}

function roundFee(fee) {
  if (Number.isInteger(fee)) {
    return fee.toFixed(2);
  }

  const decimal = fee.toString().split('.')[1];
  if (!decimal) {
    return 'numbers format is corupted'; // need to check if fee isn't scientific (exponent) notation and unconvert it
  }
  if (decimal.length <= 2) {
    return fee.toFixed(2);
  }

  let fixedFee = '';
  const feeWithoutDecimal = Math.trunc(fee).toString();
  let fixedDecimal = '';
  fixedDecimal = fixedDecimal.concat(decimal.slice(0, 2), 9); // if fee decimal ~.000000000000001 then it turns to .009 and further rounds to .01
  fixedFee = fixedFee.concat(feeWithoutDecimal, '.', fixedDecimal);

  return parseFloat(fixedFee).toFixed(2);
}

function calculateCashIn(operationAmount, commissionFee, maxFee) {
  if (operationAmount * commissionFee > maxFee) {
    return maxFee;
  }
  return operationAmount * commissionFee;
}

function calculateCachOutLegalPersons(operationAmount, commissionFee, minFee) {
  if (operationAmount * commissionFee < minFee) {
    return minFee;
  }
  return operationAmount * commissionFee;
}

// function not doing what need jet.
function calculateCachOutNaturalPersons(
  date,
  userID,
  operationAmount,
  commissionFee,
  weekLimit
) {
  const b = new Date(date).toLocaleDateString('en-US');
  const a = currentWeekNumber(b);
  return a; // returns week number when operation was made
}

function main() {
  if (!inputData(inputFileName())) {
    process.stdout.write(
      '\n<<<<< There is no input data file or it is corupted >>>>>\n\n'
    );
    return;
  }

  inputData(inputFileName()).forEach(function calculate(i) {
    if (i.type === 'cash_in') {
      process.stdout.write(
        roundFee(calculateCashIn(i.operation.amount, 0.0003, 5)).toString()
      );
      process.stdout.write('\n');
    } else if (i.type === 'cash_out' && i.user_type === 'juridical') {
      process.stdout.write(
        roundFee(
          calculateCachOutLegalPersons(i.operation.amount, 0.003, 0.5)
        ).toString()
      );
      process.stdout.write('\n');
    } else if (i.type === 'cash_out' && i.user_type === 'natural') {
      process.stdout.write(
        calculateCachOutNaturalPersons(
          i.date,
          i.user_id,
          i.operation.amount,
          0.003,
          1000
        ).toString()
      );
      process.stdout.write('\n');
    }
  });
}

main();
