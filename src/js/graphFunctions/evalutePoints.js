import { isComplex } from 'mathjs';
import { derivativeAtPoint, isVerticalAsymptote, limit } from '../../utils/Maths';

const evaluatePoints = (f, from, to, delta) => {
  const MAX_VALUE = 2 ** 28;
  const h = 1e-8;
  const deltaX = 1e-5;
  const limitDelta = 1e-6;
  const data = [];

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
      var prevArgument = prevPoint.x;

      if (Math.sign(prevSlope) === 1 && Math.sign(slope) === 1 && prevValue > value) {
        pointData.hole = true;

        prevPoint.lim = 1;
        pointData.lim = -1;

        prevPoint.holeX = argument + delta / 2;
        pointData.holeX = argument - delta / 2;
      } else if (Math.sign(prevSlope) === -1 && Math.sign(slope) === -1 && prevValue < value) {
        pointData.hole = true;

        prevPoint.lim = -1;
        pointData.lim = 1;

        prevPoint.holeX = argument + delta / 2;
        pointData.holeX = argument - delta / 2;
      } else if (Math.sign(prevSlope) === 1 && Math.sign(slope) === -1) {
        var prevArgument0 = prevArgument + deltaX;
        var argument0 = argument - deltaX;

        var limLeft = limit(f, prevArgument0, limitDelta, -1);
        var limRight = limit(f, argument0, limitDelta, 1);

        if (
          derivativeAtPoint(f, prevArgument, h) < derivativeAtPoint(f, prevArgument0, h) &&
          derivativeAtPoint(f, argument0, h) < derivativeAtPoint(f, argument, h) &&
          limLeft === 'infinity' &&
          limRight === 'infinity'
        ) {
          pointData.hole = true;

          prevPoint.lim = 1;
          pointData.lim = 1;

          prevPoint.holeX = argument + delta / 2;
          pointData.holeX = argument - delta / 2;
        }
      } else if (Math.sign(prevSlope) === -1 && Math.sign(slope) === 1) {
        var prevArgument0 = prevArgument + deltaX;
        var argument0 = argument - deltaX;

        var limLeft = limit(f, prevArgument0, limitDelta, -1);
        var limRight = limit(f, argument0, limitDelta, 1);

        if (
          derivativeAtPoint(f, prevArgument, h) > derivativeAtPoint(f, prevArgument0, h) &&
          derivativeAtPoint(f, argument0, h) > derivativeAtPoint(f, argument, h) &&
          limLeft === '-infinity' &&
          limRight === '-infinity'
        ) {
          pointData.hole = true;

          prevPoint.lim = -1;
          pointData.lim = -1;

          prevPoint.holeX = argument + delta / 2;
          pointData.holeX = argument - delta / 2;
        }
      }
    }

    data.push(pointData);
  }

  // check first and last point limits
  var firstPoint = data[0];
  var lastPoint = data[data.length - 1];

  var firstXLimit = limit(f, firstPoint.x, limitDelta, 1);
  var lastXLimit = limit(f, lastPoint.x, limitDelta, -1);

  if (firstXLimit === 'infinity') {
    firstPoint.lim = 1;
    firstPoint.holeX = firstPoint.x - delta / 2;
  } else if (firstXLimit === '-infinity') {
    firstPoint.lim = -1;
    firstPoint.holeX = firstPoint.x - delta / 2;
  }

  if (lastXLimit === 'infinity') {
    lastPoint.lim = 1;
    lastPoint.holeX = lastPoint.x + delta / 2;
  } else if (lastXLimit === '-infinity') {
    lastPoint.lim = -1;
    lastPoint.holeX = lastPoint.x + delta / 2;
  }

  return data;
};

export default evaluatePoints;
