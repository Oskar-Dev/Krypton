import { isComplex } from 'mathjs';

export const pointDistance = (x_1, y_1, x_2, y_2) => {
  return Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);
};

export const derivativeAtPoint = (f, x_0, h) => {
  return (f(x_0 + h) - f(x_0)) / h;
};

export const isVerticalAsymptote = (derivativeAtX_0, derivativeAtX_1, valueAtX_0, valueAtX_1) => {
  return (
    (Math.sign(derivativeAtX_0) > 0 && Math.sign(derivativeAtX_1) > 0 && valueAtX_1 < valueAtX_0) ||
    (Math.sign(derivativeAtX_0) < 0 && Math.sign(derivativeAtX_1) < 0 && valueAtX_1 > valueAtX_0) ||
    (Math.sign(derivativeAtX_0) == 0 && Math.sign(derivativeAtX_1) == 0 && valueAtX_1 != valueAtX_0) ||
    !isFinite(valueAtX_0) ||
    !isFinite(valueAtX_1)
    // Math.sign(derivativeAtX_0) !== Math.sign(derivativeAtX_1)
  );
};

export const findVerticalAsymptote = (f, h, n, a, b) => {
  const delta = 0.00000001;
  const data = {
    value: null,
    asymptote: true,
  };

  if (!isFinite(f(a)) && (!isFinite(f(a + delta)) || (!isFinite(f(a - delta)) && isFinite(b)))) {
    var x = b;
    var deltaB = 0.01;

    while (isFinite(f(x))) {
      x -= deltaB;
    }

    if (Math.abs(f(x + deltaB) - f(x + 2 * deltaB)) <= 0.5) {
      data.asymptote = false;
      return data;
    }
  } else if (!isFinite(f(b)) && (!isFinite(f(b + delta)) || !isFinite(f(b - delta)))) {
    var x = a;
    var deltaA = 0.01;

    while (isFinite(f(x))) {
      x += deltaA;
    }

    if (Math.abs(f(x - deltaA) - f(x - 2 * deltaA)) <= 0.5) {
      data.asymptote = false;
      return data;
    }
  } else if (
    !isFinite(b) &&
    !isFinite(f(b + delta)) &&
    !isFinite(f(b - delta)) &&
    !isFinite(f(a)) &&
    !isFinite(f(a + delta)) &&
    !isFinite(f(a - delta))
  ) {
    data.asymptote = false;
    return data;
  }

  if (!isFinite(f(a)) && isFinite(f(a - delta)) && isFinite(f(a + delta))) {
    data.value = a;
    return data;
  }

  if (!isFinite(f(b)) && isFinite(f(b - delta)) && isFinite(f(b + delta))) {
    data.value = b;
    return data;
  }

  for (var i = 0; i < n; i++) {
    var average = (a + b) / 2;

    var derivativeAtB = derivativeAtPoint(f, b, h);
    var derivativeAtAverage = derivativeAtPoint(f, average, h);
    var valueAtB = f(b);
    var valueAtAverage = f(average);
    var derivativeAtA = derivativeAtPoint(f, a, h);
    var valueAtA = f(a);

    if (isVerticalAsymptote(derivativeAtAverage, derivativeAtB, valueAtAverage, valueAtB)) {
      a = average;
    } else if (isVerticalAsymptote(derivativeAtA, derivativeAtAverage, valueAtA, valueAtAverage)) {
      b = average;
    }
  }

  data.value = (a + b) / 2;
  return data;
};

export const evaluateFunction = (f, from, to, delta) => {
  // const h = 0.0000001;
  // const maxDiff = 0.005;
  // const minDiff = 20;
  var data = [];

  for (var x = from / delta; x <= to / delta; x++) {
    var x_ = x * delta;
    var value = f(x_);

    if (isComplex(value)) value = undefined;

    data.push({ argument: x_, value: value });
  }

  // var size = data.length;
  // for (var i = 1; i < size - 1; i++) {
  //   var previous = data[i - 1];
  //   var current = data[i];
  //   var next = data[i + 1];

  //   var derivativeAtPrevious = derivativeAtPoint(f, previous.value, h);
  //   var derivativeAtCurrent = derivativeAtPoint(f, current.value, h);
  //   var derivativeAtNext = derivativeAtPoint(f, next.value, h);

  //   if (
  //     (Math.abs(derivativeAtPrevious - derivativeAtCurrent) <= maxDiff &&
  //       Math.abs(derivativeAtCurrent - derivativeAtNext) <= maxDiff) ||
  //     (Math.abs(derivativeAtPrevious - derivativeAtCurrent) >= minDiff &&
  //       Math.abs(derivativeAtCurrent - derivativeAtNext) >= minDiff)
  //   ) {
  //     data.splice(i, 1);
  //     i--;
  //     size = data.length;
  //   }
  // }

  return data;
};
