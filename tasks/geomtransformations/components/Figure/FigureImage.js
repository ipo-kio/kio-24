import React from 'react';
import { Line } from 'react-konva';

export function FigureImage({ points }) {
  return (
    <>
      <Line
        points={points}
        stroke={'blue'}
        dash={[4, 2]}
        strokeWidth={1}
        closed={true}
      />
    </>
  );
}
