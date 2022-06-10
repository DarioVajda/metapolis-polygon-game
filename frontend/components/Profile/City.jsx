import React, { useState, useEffect } from 'react'

import styles from './profile.module.css';

import MoneyIcon from '../universal/MoneyIcon';
import IncomeIcon from '../universal/IncomeIcon';
import ScoreIcon from '../universal/ScoreIcon';

const City = ({ id, data }) => {
  return (
    <div className={styles.nftitem}>
      <div className={styles.city}>
        city
      </div>
      <div className={styles.citydata}>
        <div className={styles.cityDataLeft}>
          City #{id}
          {
            data.money !== undefined &&
            <div className={styles.money}>
              <MoneyIcon size={1.1} />
              {data.money.toLocaleString('en-US')}
            </div>
          }
          {
            data.income !== undefined &&
            <div className={styles.income}>
              <IncomeIcon size={1.1} />
              {data.income.toLocaleString('en-US')}
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
              <span>{data.price.price} {data.price.token}</span>
            </>:
            <></>
          }
        </div>
      </div>
    </div>
  )
}

export default City