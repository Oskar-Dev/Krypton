// const updateScope = () => {
//   Object.keys(scope)
// }

export const pointDistance = (x_1, y_1, x_2, y_2) => {
  return Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);
};

export const derivativeAtPoint = (f, scope) => {
  const h = 1e-8;

  var value = f.evaluate(scope);

  scope.x += h;
  var deltaValue = f.evaluate(scope);

  return (deltaValue - value) / h;
};

export const findHole = (f, x_1, x_2, scope) => {
  const loops = 24;
  var middleX = (x_1 + x_2) / 2;

  scope.x = middleX;
  var middleSlope = derivativeAtPoint(f, scope);

  scope.x = x_1;
  var slope1 = derivativeAtPoint(f, scope);

  scope.x = x_2;
  var slope2 = derivativeAtPoint(f, scope);

  for (var i = 0; i < loops; i++) {
    if (isNaN(middleSlope)) {
      return middleX;
    } else if (Math.sign(slope1) !== Math.sign(middleSlope)) {
      x_2 = middleX;

      middleX = (x_1 + x_2) / 2;

      scope.x = middleX;
      middleSlope = derivativeAtPoint(f, scope);

      scope.x = x_1;
      slope1 = derivativeAtPoint(f, scope);

      scope.x = x_2;
      slope2 = derivativeAtPoint(f, scope);
    } else if (Math.sign(slope2) !== Math.sign(middleSlope)) {
      x_1 = middleX;

      middleX = (x_1 + x_2) / 2;

      scope.x = middleX;
      middleSlope = derivativeAtPoint(f, scope);

      scope.x = x_1;
      slope1 = derivativeAtPoint(f, scope);

      scope.x = x_2;
      slope2 = derivativeAtPoint(f, scope);
    }
  }

  return middleX;
};

export const findOneWayAsymptote = (f, x_1, x_2, scope) => {
  if (x_1 === undefined || x_2 === undefined) return undefined;

  const LOOPS = 20;

  scope.x = x_1;
  var y_1 = f.evaluate(scope);

  scope.x = x_2;
  var y_2 = f.evaluate(scope);
  var middleX, middleY, prevMiddleX;

  if (isNaN(y_1) || !isFinite(y_1)) {
    prevMiddleX = x_2;

    for (var i = 0; i < LOOPS; i++) {
      middleX = (x_1 + x_2) / 2;

      scope.x = middleX;
      var middleY = f.evaluate(scope);

      if (isNaN(middleY) || !isFinite(middleY)) {
        x_1 = middleX;
      } else {
        x_2 = middleX;
      }

      prevMiddleX = middleX;
    }
  } else if (isNaN(y_2) || !isFinite(y_2)) {
    prevMiddleX = x_1;

    for (var i = 0; i < LOOPS; i++) {
      middleX = (x_1 + x_2) / 2;

      scope.x = middleX;
      var middleY = f.evaluate(scope);

      if (isNaN(middleY) || !isFinite(middleY)) {
        x_2 = middleX;
      } else {
        x_1 = middleX;
      }

      prevMiddleX = middleX;
    }
  }

  return middleX;
};

export const limit = (f, x_0, scope, delta, sign) => {
  if (x_0 === undefined) return undefined;

  const MAX_DIFF = 0.1;

  if (sign === -1) {
    var x_1 = x_0 - delta;
    var x_2 = x_1 - delta;
    var x_3 = x_2 - delta;

    scope.x = x_1;
    var y_1 = f.evaluate(scope);
    var slope = derivativeAtPoint(f, scope);

    scope.x = x_2;
    var y_2 = f.evaluate(scope);

    scope.x = x_3;
    var y_3 = f.evaluate(scope);

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

    scope.x = x_1;
    var y_1 = f.evaluate(scope);
    var slope = derivativeAtPoint(f, scope);

    scope.x = x_2;
    var y_2 = f.evaluate(scope);

    scope.x = x_3;
    var y_3 = f.evaluate(scope);

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

export const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};

export const lerp = (x0, x1, t) => {
  return (1 - t) * x0 + t * x1;
};
