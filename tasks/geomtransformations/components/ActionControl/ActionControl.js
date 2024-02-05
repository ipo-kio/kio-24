import React from 'react';
import styles from './ActionControl.module.css';

import { ACTIONS } from '../../constants/Actions';

export function ActionControl({ handleClick }) {
  return (
    <div className={styles['action-control']}>
      <div className={styles['apply-btn-container']}>
        <button
          className={styles['apply-btn']}
          onClick={() => handleClick(ACTIONS.APPLY, {})}
        >
          Применить
        </button>
      </div>
      <div className={styles['undo-redo-btn-container']}>
        <button
          className={styles['undo-redo-btn']}
          onClick={() => handleClick(ACTIONS.UNDO, {})}
        >
          {'\u21B6'}
        </button>
        <button
          className={styles['undo-redo-btn']}
          onClick={() => handleClick(ACTIONS.REDO, {})}
        >
          {'\u21B7'}
        </button>
      </div>
    </div>
  );
}
