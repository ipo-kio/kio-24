import React from 'react';
import styles from './Transformations.module.css';

import { TRANSFORMATIONS } from '../../constants/Transformations';
import { ACTIONS } from '../../constants/Actions';

export function Transformations({
  transformation,
  setTransformation,
  handleChange
}) {
  return (
    <div className={styles['transformations']}>
      <h2 style={{textAlign: "center"}}>Преобразования</h2>
      <div className={styles['radio-btn']}>
        <input
          type={"radio"}
          id={TRANSFORMATIONS.REFLECT}
          value={TRANSFORMATIONS.REFLECT}
          checked={transformation === TRANSFORMATIONS.REFLECT}
          onChange={() => {
            setTransformation(TRANSFORMATIONS.REFLECT);
            handleChange(
              ACTIONS.SET_TRANSFORMATION,
              {transformation: TRANSFORMATIONS.REFLECT}
            );
          }}
        />
        <label htmlFor={TRANSFORMATIONS.REFLECT}>
          Симметрия относительно прямой DE
        </label>
      </div>

      <div className={styles['radio-btn']}>
        <input
          type={"radio"}
          id={TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE}
          value={TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE}
          checked={transformation === TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE}
          onChange={() => {
            setTransformation(TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE);
            handleChange(
              ACTIONS.SET_TRANSFORMATION,
              {transformation: TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE}
            );
          }}
        />
        <label htmlFor={TRANSFORMATIONS.ROTATE_COUNTER_CLOCKWISE}>
          Поворот относительно точки B на угол ABC против часовой стрелки
        </label>
      </div>

      <div className={styles['radio-btn']}>
        <input
          type={"radio"}
          id={TRANSFORMATIONS.ROTATE_CLOCKWISE}
          value={TRANSFORMATIONS.ROTATE_CLOCKWISE}
          checked={transformation === TRANSFORMATIONS.ROTATE_CLOCKWISE}
          onChange={() => {
            setTransformation(TRANSFORMATIONS.ROTATE_CLOCKWISE);
            handleChange(
              ACTIONS.SET_TRANSFORMATION,
              {transformation: TRANSFORMATIONS.ROTATE_CLOCKWISE}
            );
          }}
        />
        <label htmlFor={TRANSFORMATIONS.ROTATE_CLOCKWISE}>
          Поворот относительно точки B на угол ABC по часовой стрелке
        </label>
      </div>
    </div>
  );
}
