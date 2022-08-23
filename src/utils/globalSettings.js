export const defaultSettings = {
  general: {
    theme: 'light',
    textSize: 'normal',
  },
  axisX: {
    label: 'X',
    show: true,
  },
};

export const settings = {
  general: { ...defaultSettings.general },
  axisX: { ...defaultSettings.axisX },
};
