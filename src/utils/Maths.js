export const pointDistance = (x_1, y_1, x_2, y_2) => {
  return Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);
};

export const derivativeAtPoint = (f, x_0, h) => {
  return (f.evaluate({ x: x_0 + h }) - f.evaluate({ x: x_0 })) / h;
};

export const limit = (f, x_0, delta, sign) => {
  if (sign === -1) {
    var x_1 = x_0 - delta;
    var x_2 = x_1 - delta;
    var x_3 = x_2 - delta;

    var y_1 = f.evaluate({ x: x_1 });
    var y_2 = f.evaluate({ x: x_2 });
    var y_3 = f.evaluate({ x: x_3 });

    var slope = derivativeAtPoint(f, x_1, 1e-8);

    if (Math.abs(y_3 - y_2) < Math.abs(y_1 - y_2) && Math.abs(y_1 - y_2) > 1e-6) {
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

    if (Math.abs(y_3 - y_2) < Math.abs(y_1 - y_2) && Math.abs(y_1 - y_2) > 1e-6) {
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
