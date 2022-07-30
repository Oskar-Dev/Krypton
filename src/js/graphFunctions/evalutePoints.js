import { isComplex } from 'mathjs';

const evaluatePoints = (f, from, to, delta) => {
  const MAX_VALUE = 2 ** 28;
  var data = [];

  // console.log(latex);
  // var l = parseLatex(latex);
  // console.log(l);

  for (var x = Math.floor(from / delta); x <= Math.floor(to / delta); x++) {
    var x_ = x * delta;
    // var value = f({ x: x_ });
    var value = f.evaluate({ x: x_ });

    if (isComplex(value) || isNaN(value) || value >= MAX_VALUE || value <= -MAX_VALUE) continue;

    var pointData = { x: x_, y: value };

    data.push(pointData);
  }

  return data;
};

export default evaluatePoints;
