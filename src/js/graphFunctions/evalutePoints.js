import { isComplex } from 'mathjs';

const evaluatePoints = (f, from, to, delta) => {
  var data = [];

  // console.log(latex);
  // var l = parseLatex(latex);
  // console.log(l);

  for (var x = Math.floor(from / delta); x <= Math.floor(to / delta); x++) {
    var x_ = x * delta;
    // var value = f({ x: x_ });
    var value = f.evaluate({ x: x_ });

    if (isComplex(value)) value = undefined;

    var pointData = { arg: x_, val: value };

    data.push(pointData);
  }

  return data;
};

export default evaluatePoints;
