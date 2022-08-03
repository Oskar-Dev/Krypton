export const pointDistance = (x_1, y_1, x_2, y_2) => {
  return Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);
};

export const derivativeAtPoint = (f, x_0, h) => {
  return (f.evaluate({ x: x_0 + h }) - f.evaluate({ x: x_0 })) / h;
};

export const findHole = (f, x_1, x_2) => {
  const h = 1e-8;
  const loops = 24;
  var middleX = (x_1 + x_2) / 2;

  var middleSlope = derivativeAtPoint(f, middleX, h);
  var slope1 = derivativeAtPoint(f, x_1, h);
  var slope2 = derivativeAtPoint(f, x_2, h);

  for (var i = 0; i < loops; i++) {
    if (isNaN(middleSlope)) {
      return middleX;
    } else if (Math.sign(slope1) !== Math.sign(middleSlope)) {
      x_2 = middleX;

      middleX = (x_1 + x_2) / 2;
      middleSlope = derivativeAtPoint(f, middleX, h);
      slope1 = derivativeAtPoint(f, x_1, h);
      slope2 = derivativeAtPoint(f, x_2, h);
    } else if (Math.sign(slope2) !== Math.sign(middleSlope)) {
      x_1 = middleX;

      middleX = (x_1 + x_2) / 2;
      middleSlope = derivativeAtPoint(f, middleX, h);
      slope1 = derivativeAtPoint(f, x_1, h);
      slope2 = derivativeAtPoint(f, x_2, h);
    }
  }

  return middleX;
};

export const findOneWayAsymptote = (f, x_1, x_2) => {
  const loops = 25;

  var y_1 = f.evaluate({ x: x_1 });
  var y_2 = f.evaluate({ x: x_2 });
  var middleX, middleY;

  if (isNaN(y_1) || !isFinite(y_1)) {
    var prevMiddleX = x_2;

    for (var i = 0; i < loops; i++) {
      middleX = (x_1 + x_2) / 2;
      var middleY = f.evaluate({ x: middleX });
      if (isNaN(middleY) || !isFinite(middleY)) return prevMiddleX;

      prevMiddleX = middleX;
      x_2 = middleX;
    }
  } else if (isNaN(y_2) || !isFinite(y_2)) {
    var prevMiddleX = x_1;

    for (var i = 0; i < loops; i++) {
      middleX = (x_1 + x_2) / 2;
      if (isNaN(middleX) || !isFinite(middleX)) return prevMiddleX;

      prevMiddleX = middleX;
      x_1 = middleX;
    }
  }

  return middleX;
};

export const limit = (f, x_0, delta, sign) => {
  const MAX_DIFF = 0.1;

  if (sign === -1) {
    var x_1 = x_0 - delta;
    var x_2 = x_1 - delta;
    var x_3 = x_2 - delta;

    var y_1 = f.evaluate({ x: x_1 });
    var y_2 = f.evaluate({ x: x_2 });
    var y_3 = f.evaluate({ x: x_3 });

    var slope = derivativeAtPoint(f, x_1, 1e-8);

    if (Math.abs(y_3 - y_2) < Math.abs(y_1 - y_2) && Math.abs(y_1 - y_2) > MAX_DIFF) {
      if (Math.sign(slope) === 1) {
        return 'infinity';
      } else if (Math.sign(slope) === -1) {
        return '-infinity';
      } else {
        return y_1;
      }
    } else {
      return y_1;
    }
  } else if (sign === 1) {
    var x_1 = x_0 + delta;
    var x_2 = x_1 + delta;
    var x_3 = x_2 + delta;

    var y_1 = f.evaluate({ x: x_1 });
    var y_2 = f.evaluate({ x: x_2 });
    var y_3 = f.evaluate({ x: x_3 });

    var slope = derivativeAtPoint(f, x_1, 1e-8);

    if (Math.abs(y_3 - y_2) < Math.abs(y_1 - y_2) && Math.abs(y_1 - y_2) > MAX_DIFF) {
      if (Math.sign(slope) === 1) {
        return '-infinity';
      } else if (Math.sign(slope) === -1) {
        return 'infinity';
      } else {
        return y_1;
      }
    } else {
      return y_1;
    }
  } else {
    return undefined;
  }
};
