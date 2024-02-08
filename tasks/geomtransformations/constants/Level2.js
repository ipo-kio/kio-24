import { FIGURE1, FIGURE2, FIGURE5 } from "./Figures";

export const FIGURES = [{
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
    color: FIGURE5.COLOR,
    points: [FIGURE5.POINTS],
    transformations: [],
    stateIdx: 0
  }
];

export const MIN_FIGURES_PERIMETER = 16;
export const FIGURES_AREA = 16;

export const LEVEL2 = {
  figures: FIGURES,
  figuresArea: FIGURES_AREA,
  minFiguresPerimeter: MIN_FIGURES_PERIMETER
};
