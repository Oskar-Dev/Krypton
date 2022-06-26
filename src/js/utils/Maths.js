export const pointDistance = (x_1, y_1, x_2, y_2) => {
  return Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);
};

export const derivativeAtPoint = (f, x_0, h) => {
  return (f(x_0 + h) - f(x_0)) / h;
};

export const isVerticalAsymptote = (f, h, x_1, x_2) => {
  return (
    (Math.sign(derivativeAtPoint(f, x_1, h)) > 0 && Math.sign(derivativeAtPoint(f, x_2, h)) > 0 && f(x_2) < f(x_1)) ||
    (Math.sign(derivativeAtPoint(f, x_1, h)) < 0 && Math.sign(derivativeAtPoint(f, x_2, h)) < 0 && f(x_2) > f(x_1)) ||
    (Math.sign(derivativeAtPoint(f, x_1, h)) == 0 && Math.sign(derivativeAtPoint(f, x_2, h)) == 0 && f(x_2) != f(x_1)) ||
    !isFinite(f(x_1)) ||
    !isFinite(f(x_2))
  );
};

export const findVerticalAsymptote = (f, h, n, a, b) => {
  if (!isFinite(f(a))) return a;
  if (!isFinite(f(b))) return b;

  for (var i = 0; i < n; i++) {
    var average = (a + b) / 2;

    if (isVerticalAsymptote(f, h, average, b)) {
      a = average;
    }

    if (isVerticalAsymptote(f, h, a, average)) {
      b = average;
    }
  }

  return (a + b) / 2;
};
