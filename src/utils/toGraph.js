import { graphColors } from './graphColors';

export const defaultGraphSettings = {
  opacity: 0.9,
  width: 3,
  color: graphColors[0],
  lineDash: { style: [], index: 0 },
};

export const lineDashStyles = [[], [10], [1, 10]];

export const toGraph = [{ func: null, settings: { ...defaultGraphSettings } }];
