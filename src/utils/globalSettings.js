export const defaultSettings = {
  general: {
    theme: 'light',
    textSize: 'normal',
  },
  axisX: {
    label: 'X',
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
};
