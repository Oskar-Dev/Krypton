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
  grid: {
    show: true,
    showSmallGrid: false,
    width: 1,
    height: 1,
  },
  advanced: {
    graphQuality: 0.025,
    preciseFirstAndLastPoints: true,
  },
};

export const settings = {
  general: { ...defaultSettings.general },
  axisX: { ...defaultSettings.axisX },
  axisY: { ...defaultSettings.axisY },
  grid: { ...defaultSettings.grid },
  advanced: { ...defaultSettings.advanced },
};
