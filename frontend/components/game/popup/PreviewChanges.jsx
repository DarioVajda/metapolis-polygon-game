import React from 'react'
import { useBuildingStore } from '../BuildingStore';

import styles from './previewChanges.module.css';

import MoneyIcon from '../../universal/icons/MoneyIcon';
import XIcon from '../../universal/icons/XIcon';

const Change = ({ instruction }) => {

  const descriptions = (instruction) => {
    if(instruction.instruction === 'upgrade') {
      return <>Upgraded {instruction.body.building.type} to level {instruction.body.building.level + instruction.body.deltaLevel + 1} from {instruction.body.building.level + 1}.</>
    }
    else if(instruction.instruction === 'rotate') {
      return <>Rotated {instruction.body.building.type} by {(instruction.body.rotation-instruction.body.building.orientation)*90}°.</>
    }
    else if(instruction.instruction === 'remove') {
      return <>Sold a level {instruction.body.building.level+1} {instruction.body.building.type} for 50% of its build value.</>
    }
    else return <>{instruction.instruction}</>
  }

  const description = descriptions(instruction);

  return (
    <div className={styles.change}>
      <div>
        <div>
          {instruction.instruction}
        </div>
        <div>
          <MoneyIcon size={0.8} />
          <span style={{ color: instruction.price === 0 ? 'white' : instruction.price > 0 ? 'rgb(255, 130, 130)' : 'rgb(130, 255, 130)' }}>
            {instruction.price >= 0 ? '' : '+'}
            { 
              instruction.price !== 0 ? 
              -instruction.price : 
              <div style={{ fontSize: '.8em' }}>FREE</div> 
            }
          </span>
        </div>
      </div>
      <div className={styles.message}>
        {description}
      </div>
    </div>
  )
}

const PreviewChanges = ({ closePopup }) => {

  const instructions = useBuildingStore(state => state.instructions);

  return (
    <div className={styles.wrapper} >
      <div className={styles.title}>
        Changes
        <XIcon onClick={() => closePopup()} />
      </div>
      <div className={styles.content}>
        <div className={styles.first}></div>
        {
          instructions.length > 0 ?
          instructions
            .sort((a, b) => Math.abs(b.price) - Math.abs(a.price))
            .map((instruction, index) => (
              <Change instruction={instruction} key={index} />
            )) :
          <div className={styles.message}>
            No changes were made to the city since the last login.
          </div>
        }
        <div className={styles.last}></div>
      </div>
    </div>
  )
}

export default PreviewChanges