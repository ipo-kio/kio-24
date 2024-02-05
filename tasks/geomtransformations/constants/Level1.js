import { FIGURE1, FIGURE2 } from "./Figures";

const FIGURES = [{
    id: 1,
    color: FIGURE1.COLOR,
    points: [FIGURE1.POINTS],
    transformations: [],
    stateIdx: 0
  }, {
    id: 2,
    color: FIGURE2.COLOR,
    points: [FIGURE2.POINTS],
    transformations: [],
    stateIdx: 0
  }
];

const MIN_FIGURES_PERIMETER = 12;

export const LEVEL1 = {
  figures: FIGURES,
  minFiguresPerimeter: MIN_FIGURES_PERIMETER
};
