import { isComplex } from 'mathjs';
import { derivativeAtPoint, isVerticalAsymptote } from '../../utils/Maths';

const evaluatePoints = (f, from, to, delta) => {
  const MAX_VALUE = 2 ** 28;
  const h = 1e-8;
  const data = [];

  // console.log(latex);
  // var l = parseLatex(latex);
  // console.log(l);

  for (var x = Math.floor(from / delta); x <= Math.floor(to / delta); x++) {
    var argument = x * delta;
    // var value = f({ x: x_ });
    var value = f.evaluate({ x: argument });

    if (isComplex(value) || isNaN(value) || value >= MAX_VALUE || value <= -MAX_VALUE) continue;
    var pointData = { x: argument, y: value, hole: false };

    if (data.length > 0) {
      var prevPoint = data[data.length - 1];

      var prevSlope = derivativeAtPoint(f, prevPoint.x, h);
      var currentSlope = derivativeAtPoint(f, argument, h);

      if (isVerticalAsymptote(prevSlope, currentSlope, prevPoint.y, value)) pointData.hole = true;
    }

    data.push(pointData);
  }

  return data;
};

export default evaluatePoints;
