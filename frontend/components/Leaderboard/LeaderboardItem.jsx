import React, { useEffect, useRef, useState } from 'react'

import style from './leaderboard.module.css';

const LeaderboardItem = ({ index, id, expanded, loadCity, expand }) => {

  const [data, setData] = useState(false);
  const idLoaded = useRef(false);
  const dataLoaded = useRef(false);

  const getData = async () => {
    loadCity(id, index).then(res => {
      if(dataLoaded.current) return;

      // console.log(res);
      idLoaded.current = true;
      setData(res);
      dataLoaded.current = true;
    });
  }

  if(idLoaded.current === false && id >= 0) {
    getData();
  }

  return (
    <div className={style.city}>
      <div className={style.top} onClick={() => expand(index)}>
        <div className={style.id}>
          {index+1}. City #{id}
        </div>
        <div className={style.money}>
          Money: ${data.money}
        </div>
        <div className={style.income}>
          Income: ${data.income}
        </div>
        <div className={`${style.arrow} ${expanded&&style.arrowUp}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
          </svg>
        </div>
      </div>
      <div className={`${style.more} ${!expanded&&style.hide}`}>
        <div className={style.temp}></div>
      </div>
    </div>
  )
}

export default LeaderboardItem