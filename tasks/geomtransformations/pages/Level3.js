import { GeomStage } from '../components/GeomStage/GeomStage';
import { FIGURES, MIN_FIGURES_PERIMETER } from '../constants/Level3';

export function Level3() {
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
