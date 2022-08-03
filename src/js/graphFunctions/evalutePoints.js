import math, { e, isComplex } from 'mathjs';
import { derivativeAtPoint, findHole, findOneWayAsymptote, limit } from '../../utils/Maths';

const evaluatePoints = (f, from, to, delta) => {
  const MAX_VALUE = 2 ** 28;
  const h = 1e-8;
  const deltaX = 1e-5;
  const limitDelta = 1e-7;
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

      // check for sigle points
      if (data.length > 1) {
        var prevPrevPoint = data[data.length - 2];

        if (Math.abs(prevPrevPoint.x - prevArgument) > delta * 2 && Math.abs(prevArgument - argument) > delta * 2)
          data.pop();
      }

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

        var holeX_ = findHole(f, prevArgument, argument);
        var limLeft = limit(f, holeX_, limitDelta, -1);
        var limRight = limit(f, holeX_, limitDelta, 1);

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
        if (Math.abs(prevArgument - argument) > delta * 2) {
          prevPoint.lim = -1;
          pointData.lim = -1;

          prevPoint.holeX = prevPoint.x + delta / 2;
          pointData.holeX = argument - delta / 2;
          pointData.hole = true;
        } else {
          var prevArgument0 = prevArgument + deltaX;
          var argument0 = argument - deltaX;

          var holeX_ = findHole(f, prevArgument, argument);
          var limLeft = limit(f, holeX_, limitDelta, -1);
          var limRight = limit(f, holeX_, limitDelta, 1);

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
    }

    data.push(pointData);
  }

  var firstPoint = data[0];
  var secondPoint = data[1];
  var lastPoint = data[data.length - 1];
  var secondLastPoint = data[data.length - 2];

  // check if first or last point are lonely
  if (Math.abs(firstPoint.x - secondPoint.x) > delta * 2) data.shift();

  if (Math.abs(lastPoint.x - secondLastPoint.x) > delta * 2) data.pop();

  // check first and last point limits
  var firstX = findOneWayAsymptote(f, firstPoint.x - delta, firstPoint.x);
  var lastX = findOneWayAsymptote(f, lastPoint.x, lastPoint.x + delta);

  var firstXLimit = limit(f, firstX, limitDelta, 1);
  var lastXLimit = limit(f, lastX, limitDelta, -1);

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
