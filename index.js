const fs = require('fs');

const readMe = JSON.parse(fs.readFileSync('input.json', 'utf8'));

readMe.forEach(function calculate(i) {
  if (i.type === 'cash_in') {
    console.log(
      i.operation.amount * 0.0003 > 5 ? 5 : i.operation.amount * 0.0003
    );
  } else if (i.user_type === 'juridical') {
    console.log(
      i.operation.amount * 0.003 < 0.5 ? 0.5 : i.operation.amount * 0.003
    );
  } else {
    const bb = (i.operation.amount * 0.003).toFixed(2);
    console.log(bb);
  }
});
