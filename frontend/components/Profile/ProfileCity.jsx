import React, { useState, useEffect } from 'react'

import styles from './profile.module.css';

import MoneyIcon from '../universal/icons/MoneyIcon';
import IncomeIcon from '../universal/icons/IncomeIcon';
import ScoreIcon from '../universal/icons/ScoreIcon';

import City from '../universal/city/City';

const compareProps = (prev, curr) => {
  return prev.id === curr.id && prev.data === curr.data;
}

const CityLoading = () => {
  return (
    <div className={styles.loadingNftitem}>
      <div className={styles.loadingCity}></div>
      <div className={styles.loadingCityData}>
          <div style={{width: '70%'}} />
          <div />
          <div />
          <div />
      </div>
    </div>
  )
}

const ProfileCity = React.memo(({ id, data, index }) => {
  if(data === false) return <CityLoading />;

  // console.log({id, data});
  return (
    <div className={styles.nftitem}>
      <div className={styles.city}>
        {/* <City id={id} dataArg={data} rotation={0} showDelay={index*300+1000} fps={1e-10} /> */}
        <div>
          <img src={`http://localhost:8000/cities/${id}/image.png`} alt="city" />
        </div>
      </div>
      <div className={styles.citydata}>
        <div className={styles.cityDataLeft}>
          { id !== undefined ? <>City #{id}</> : <></> }
          {
            data.money !== undefined &&
            <div className={styles.money}>
              <MoneyIcon size={1.1} />
              <span>{data.money.toLocaleString('en-US')}</span>
            </div>
          }
          {
            data.income !== undefined &&
            <div className={styles.income}>
              <IncomeIcon size={1.1} />
              <span>{data.income.toLocaleString('en-US')}</span>
            </div>
          }
          {
            data.score !== undefined &&
            <div className={styles.score}>
              <ScoreIcon size={1.1} />
              <span>{data.score.toLocaleString('en-US')}</span>
            </div>
          }
        </div>
        <div className={styles.cityDataRight}>
          {
            data.price ?
            <>
              <div>{data.price.message}</div>
              <span>{Math.round(data.price.price * 100) / 100} {data.price.token}</span>
            </>:
            <></>
          }
        </div>
      </div>
    </div>
  )
}, compareProps);

export default ProfileCity