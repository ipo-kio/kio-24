import React from 'react';
import { Circle, Line } from 'react-konva';

import {
  PARTICLE_COLORS
} from '../../constants/ParticlesChain';

function joinLinePoints(particles) {
  let points = [];

  particles.forEach(particle => {
    points.push(particle.x);
    points.push(particle.y);
  });

  return points;
}

function JoinLine({ particles, particleRadius }) {
  return (
    <>
      <Line
        points={joinLinePoints(particles)}
        stroke={'black'}
        strokeWidth={2}
      />
      <Circle
        key={String(particles.length + 1)}
        id={String(particles.length + 1)}
        x={particles[0].x}
        y={particles[0].y}
        radius={Math.floor(particleRadius / 8)}
        fill={'black'}
      />
      <Circle
        key={String(particles.length)}
        id={String(particles.length)}
        x={particles[particles.length - 1].x}
        y={particles[particles.length - 1].y}
        radius={Math.floor(particleRadius / 5)}
        fill={'black'}
      />
    </>
  );
}

export function ParticlesChain({
  particles,
  setParticles,
  pivotParticleId,
  setPivotParticleId,
  isSplitted,
  particleRadius,
  setEnergies,
  powers
}) {
  function handleParticleClick(particleId) {
    setPivotParticleId(Number(particleId));
  }

  const particlesChain = particles.map((particle) => (
    <Circle
      key={particle.id}
      id={particle.id}
      x={particle.x}
      y={particle.y}
      radius={particleRadius}
      fill={PARTICLE_COLORS[particle.color]}
      stroke={'black'}
      strokeWidth={particle.id == pivotParticleId ? 5 : 2}
      onClick={() => handleParticleClick(particle.id)}
    />)
  );

  let joinLine;

  if (isSplitted) {
    let particles1 = particles.slice(
      0, Math.floor(particles.length / 2)
    );

    let particles2 = particles.slice(
      Math.floor(particles.length / 2), particles.length
    );

    joinLine = <>
      <JoinLine
        particles={particles1}
        particleRadius={particleRadius}
      />
      <JoinLine
        particles={particles2}
        particleRadius={particleRadius}
      />
    </>
  } else {
    joinLine = <JoinLine
      particles={particles}
      particleRadius={particleRadius}
    />
  }

  return (
    <>
      {particlesChain}
      {joinLine}
    </>
  );
}