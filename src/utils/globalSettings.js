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
    autoNumbersDistance: false,
    numbersDistance: 2,
  },
  axisY: {
    label: 'y',
    showPositiveHalfAxis: true,
    showNegativeHalfAxis: true,
    showPositiveHalfAxisNumbers: true,
    showNegativeHalfAxisNumbers: true,
    endAxisWithArrow: true,
    autoNumbersDistance: false,
    numbersDistance: 2,
  },
  grid: {
    show: true,
    showSmallGrid: true,
    autoWidth: false,
    width: 2,
    autoHeight: false,
    height: 2,
  },
  advanced: {
    graphQuality: 0.025,
    preciseFirstAndLastPoints: true,
    animationsSpeed: 0.02,
  },
};

export const settings = {
  general: { ...defaultSettings.general },
  axisX: { ...defaultSettings.axisX },
  axisY: { ...defaultSettings.axisY },
  grid: { ...defaultSettings.grid },
  advanced: { ...defaultSettings.advanced },
};
