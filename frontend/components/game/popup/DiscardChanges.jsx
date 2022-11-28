import React from 'react'
import { useBuildingStore } from '../BuildingStore';

import styles from './discardChanges.module.css';

const DiscardChanges = ({ closePopup }) => {

  const resetInstructions = useBuildingStore(state => state.resetInstructions);
  const reuseUnchangedData = useBuildingStore(state => state.reuseUnchangedData);

  const ok = () => {
    resetInstructions();
    reuseUnchangedData();

    closePopup();
  }

  const cancel = () => {
    closePopup();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Discard Changes
      </div>
      <div className={styles.message}>
        If you discard your changes the city will stay the same as it was when you last logged in.
      </div>
      <div className={styles.bottom}>
        <button onClick={ok}>
          OK
        </button>
        <button onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default DiscardChanges