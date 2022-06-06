import React, { useState, useEffect } from 'react'

import styles from './profile.module.css'

const City = ({ id }) => {

  let [data, setData] = useState(false); // false - not loaded, { data... } - data about buildings, money, etc.

  const loadData = async () => {
    let _data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    // console.log(_data);
    setData(_data);
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div className={styles.nftitem}>
      <div className={styles.city}>
        city
      </div>
      <div className={styles.citydata}>
        City #{id}
      </div>
    </div>
  )
}

export default City