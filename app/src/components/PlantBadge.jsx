import { catIndexFor } from '../i18n';
import { plantFor, heightFor } from '../plants';

export default function PlantBadge({ category, targetHeight = 24 }) {
  const idx = catIndexFor('expense', category);
  const Plant = plantFor(idx);
  const plantH = heightFor(idx);

  const padY = 4;
  const padX = 4;
  const vbH = plantH + padY * 2;
  const vbW = 40 + padX * 2;
  const scale = targetHeight / vbH;
  const w = Math.ceil(vbW * scale);

  return (
    <svg
      width={w}
      height={targetHeight}
      viewBox={`${-20 - padX} ${-(plantH + padY)} ${vbW} ${vbH}`}
    >
      <Plant />
    </svg>
  );
}
