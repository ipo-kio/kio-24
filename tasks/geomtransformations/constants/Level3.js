import { FIGURE1, FIGURE2, FIGURE3, FIGURE4 } from "./Figures";

const LEVEL3_FIGURES = [{
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
  }, {
    id: 3,
    color: FIGURE3.COLOR,
    points: [FIGURE3.POINTS],
    transformations: [],
    stateIdx: 0
  }, {
    id: 4,
    color: FIGURE4.COLOR,
    points: [FIGURE4.POINTS],
    transformations: [],
    stateIdx: 0
  }
];

const MIN_FIGURES_PERIMETER = 16;
const FIGURES_AREA = 16;

export const LEVEL3 = {
  figures: LEVEL3_FIGURES,
  figuresArea: FIGURES_AREA,
  minFiguresPerimeter: MIN_FIGURES_PERIMETER
};
