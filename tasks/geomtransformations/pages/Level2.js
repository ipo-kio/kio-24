import { GeomStage } from '../components/GeomStage/GeomStage';
import { FIGURES, MIN_FIGURES_PERIMETER } from '../constants/Level2';

export function Level2() {
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
