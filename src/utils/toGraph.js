import { graphColors } from './graphColors';

export const defaultGraphSettings = {
  opacity: 0.9,
  width: 3,
  color: graphColors[0],
  lineDash: 0,
  boundaries: { left: null, latexLeft: null, right: null, latexRight: null },
};

export const lineDashStyles = [[], [20, 20], [1, 10]];

export const toGraph = [
  { func: null, settings: { ...defaultGraphSettings, boundaries: { ...defaultGraphSettings.boundaries } } },
];
