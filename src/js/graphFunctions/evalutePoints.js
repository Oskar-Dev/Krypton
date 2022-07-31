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
    var value = f.evaluate({ x: argument });
    var slope = derivativeAtPoint(f, argument, h);

    if (isComplex(value) || isNaN(value) || value >= MAX_VALUE || value <= -MAX_VALUE) continue;
    var pointData = { x: argument, y: value, slope: slope, hole: false, holeX: null, lim: 0 };

    if (data.length > 0) {
      var prevPoint = data[data.length - 1];
      var prevSlope = prevPoint.slope;
      var prevValue = prevPoint.y;
      var averageX = (prevPoint.x + argument) / 2;

      pointData.holeX = averageX;

      if (Math.sign(prevSlope) === 1 && Math.sign(slope) === 1 && prevValue > value) {
        pointData.hole = true;

        prevPoint.lim = 1;
        pointData.lim = -1;
      } else if (Math.sign(prevSlope) === -1 && Math.sign(slope) === -1 && prevValue < value) {
        pointData.hole = true;

        prevPoint.lim = -1;
        pointData.lim = 1;
      }
    }

    data.push(pointData);
  }

  return data;
};

export default evaluatePoints;
