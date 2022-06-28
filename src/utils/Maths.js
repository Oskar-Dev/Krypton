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
  const delta = 0.00000001;
  const data = {
    value: null,
    asymptote: true,
  };

  if (
    (!isFinite(f(a)) && !isFinite(f(a + delta)) && !isFinite(f(a - delta))) ||
    (!isFinite(f(b)) && !isFinite(f(b + delta)) && !isFinite(f(b - delta)))
  ) {
    data.asymptote = false;
    return data;
  }

  if (!isFinite(f(a))) {
    data.value = a;
    return data;
  }

  if (!isFinite(f(b))) {
    data.value = b;
    return data;
  }

  for (var i = 0; i < n; i++) {
    var average = (a + b) / 2;

    if (isVerticalAsymptote(f, h, average, b)) {
      a = average;
    }

    if (isVerticalAsymptote(f, h, a, average)) {
      b = average;
    }
  }

  data.value = (a + b) / 2;
  return data;
};
