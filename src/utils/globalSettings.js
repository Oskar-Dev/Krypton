export const defaultSettings = {
  general: {
    theme: 'light',
    textSize: 'normal',
  },
  axisX: {
    label: 'x',
    showPositiveHalfAxis: true,
    showNegativeHalfAxis: true,
    showPositiveHalfAxisNumbers: true,
    showNegativeHalfAxisNumbers: true,
    endAxisWithArrow: true,
    numbersDistance: 2,
  },
  axisY: {
    label: 'y',
    showPositiveHalfAxis: true,
    showNegativeHalfAxis: true,
    showPositiveHalfAxisNumbers: true,
    showNegativeHalfAxisNumbers: true,
    endAxisWithArrow: true,
    numbersDistance: 2,
  },
};

export const settings = {
  general: { ...defaultSettings.general },
  axisX: { ...defaultSettings.axisX },
  axisY: { ...defaultSettings.axisY },
};
