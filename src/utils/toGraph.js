import { graphColors } from './graphColors';

export const defaultGraphSettings = {
  opacity: 1,
  width: 1,
  color: graphColors[0],
};

export const toGraph = [{ func: null, settings: { ...defaultGraphSettings } }];
