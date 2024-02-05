import React from 'react';
import { GeomStage } from '../components/GeomStage/GeomStage';
import { FIGURES, MIN_FIGURES_PERIMETER } from '../constants/Level1';

export function Level1() {
  let settings = {
    figures: FIGURES,
    minFiguresPerimeter: MIN_FIGURES_PERIMETER
  };

  return (
    <>
      <GeomStage settings={settings} />
    </>
  );
}
