import { graphColors } from './graphColors';

export const defaultGraphSettings = {
  opacity: 0.9,
  width: 3,
  color: graphColors[0],
  lineDash: 0,
  boundaries: { left: null, latexLeft: null, right: null, latexRight: null },
  pointStyle: 0,
  label: '',
  expressionLeftSide: null,
  expressionRightSide: null,
  constValue: null,
};

export const lineDashStyles = [[], [20, 20], [1, 10]];

export const toGraph = [
  {
    id: 0,
    func: null,
    renderSinglePoints: false,
    settings: {
      ...defaultGraphSettings,
      boundaries: { ...defaultGraphSettings.boundaries },
      variables: { ...defaultGraphSettings.variables },
    },
  },
];
