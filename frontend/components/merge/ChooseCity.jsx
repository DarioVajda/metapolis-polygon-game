import React from 'react'

import Link from 'next/link';

import styles from './chooseCity.module.css';

// import City from '../universal/city/City';
import XIcon from '../universal/icons/XIcon';
import MoneyIcon from '../universal/icons/MoneyIcon';
import IncomeIcon from '../universal/icons/IncomeIcon';


const CityChoice = ({ data, newUrl, closePopup }) => {

  // wrap the whole thing in a Link component taking the user to the newUrl link

  return (
    <Link href={newUrl}>
      <div className={styles.cityChoice} onClick={() => closePopup()}>
        {/* <City id={data.id} dataArg={data} rotation={0} showDelay={data.id*300+1000} fps={1e-10} /> */}
        <img src={`http://localhost:8000/cities/${data.id}/image.png`} alt="city" />
        <div className={styles.info}>
          <span>
            Lvl. {data.level} City #{data.id}
          </span> 
          <span>
            <MoneyIcon />
            {data.money}
          </span> 
          <span>
            <IncomeIcon />
            {data.income}
          </span>
        </div>
      </div>
    </Link>
  )
}

const ChooseCity = ({ closePopup, first, nfts }) => {

  // console.log({first});
  let firstData = nfts.reduce((prev, curr) => curr.id == first ? curr : prev, false);
  // console.log({firstData});

  // console.log(nfts);
  let options = nfts.filter(element => !firstData || (element.theme === firstData.theme && element.initialized === true));

  const newUrl = (id) => {
    if(typeof first === 'undefined') {
      // console.log(`/game/merge?id1=${id}`);
      return `/game/merge?id1=${id}`;
    }
    else {
      // console.log(`/game/merge?id1=${first}&id2=${id}`);
      return `/game/merge?id1=${first}&id2=${id}`;
    }
  }

  const closePopupFunction = () => {
    // console.log('closing popup function');
    closePopup();
  }

  return (
    <div className={styles.chooseCity}>
      <div className={styles.top}>
        Add a new City
        <XIcon onClick={closePopup} />
      </div>
      <span className={styles.text}>
        When merging two cities they have to have the same theme.
      </span>
      <div className={styles.list}>
        <div key='first'>&nbsp;</div>
        {
          options && options.map(element => (
            <CityChoice data={element} key={element.id} newUrl={newUrl(element.id)} closePopup={closePopupFunction} />
          ))
        }
        <div key='last'>&nbsp;</div>
      </div>
    </div>
  )
}

export default ChooseCity