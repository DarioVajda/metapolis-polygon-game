import React, { useEffect } from 'react'
import { useState } from 'react';

import styles from './makeOffer.module.css';

import { useBuildingStore } from '../BuildingStore';

import XIcon from '../../universal/icons/XIcon';
import MoneyIcon from '../../universal/icons/MoneyIcon';
import ArrowIcon from '../../universal/icons/ArrowIcon';

import { specialPrices } from '../../../../server/gameplay/building_stats';

const MakeOffer = ({ closePopup, type }) => {

  const specialTypeData = useBuildingStore(state => state[`type_${type}`]);  
  const changeSpecialBuildingData = useBuildingStore(state => state.changeSpecialBuildingData);

  const [ number, setNumber ] = useState('');
  const [ showingAll, setShowingAll ] = useState(true);

  const checkChange = (e) => {
    const re = /^[0-9\b]+$/;
    if ((e.target.value === '' || re.test(e.target.value)) && e.target.value < 1e9) {
      setNumber(e.target.value);
    }
  }

  // #region realoading the data

  useEffect(() => {
    let componentActive = true;

    const delay = async (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }
    
    const reloadData = async () => {
      while(true) {
        // waiting random amount of time until the next iteration
        await delay(4000 * (1 + Math.random()));

        // breaking if the component was destroyed in the meantime
        if(componentActive === false) {
          // console.log('break');
          break;
        }
        
        // loading the new data
        let _data = await (await fetch(`http://localhost:8000/specialtype/${type}`)).json();
        // console.log(_data);
        changeSpecialBuildingData(_data, type);
      }
    }
    reloadData();

    return () => {
      componentActive = false;
    }
  }, []);

  // #endregion

  console.log(showingAll);

  // calculating how many offers are higher than the money value in the input field
  let above = specialTypeData.offers.reduce((prev, curr) => prev + (curr.value > number ? 1 : 0), 0);
  return (
    <div className={`${styles.wrapper} ${showingAll?styles.showingAll:''}`}>
      <div className={styles.topData}>
        <span>Make Offer for a {type}</span>
        <XIcon size={1} onClick={closePopup} />
      </div>
      <div className={styles.form}>
        <div className={styles.offerMessage}>
          Min. offer: {specialPrices.get(type)}
        </div>
        <div className={styles.input}>
          <div>
            <MoneyIcon />
            <input value={number} placeholder="Enter value..." onChange={checkChange} type="text" />
          </div>
          {/* <button style={number < specialPrices.get(type) ? { backgroundColor: 'var(--lightest-background)' } : {}}>Confirm</button> */}
          <button className={`${styles.activeConfirmButton} ${number < specialPrices.get(type) ? styles.inactiveConfirmButton : ''}`}>Confirm</button>
        </div>
        <div className={styles.offerMessage}>
          There will be {above} offers with higher priority
        </div>
      </div>
      <div className={styles.showOffers} onClick={() => setShowingAll(!showingAll)} >
        <ArrowIcon direction={2} size={2} />
        Show all Offers
      </div>
      <div className={styles.offerList}>
        <div />
        {
          Array(41)
            .fill(specialTypeData.offers)
            .reduce((prev, curr) => [...prev, ...curr], [])
            .map((element, index) => (
              <div key={index}>
                {element.value.toLocaleString('en-US')}
              </div>
            ))
        }
        <div />
      </div>
    </div>
  )
}

export default MakeOffer