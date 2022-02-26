import React, { useState } from 'react'
import styles from './styles/item.module.css'
// import Link from 'next/link'

const Leaderboard_item = ({ id, city, rank, expanded, setExpanded }) => {
  const [lastPrice, setLastPrice] = useState(0);
  const [price, setPrice] = useState(0);

  const money = city.money;
  const income = city.income;

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

  const getPrices = async () => {
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id+4000}/`)).json();
    var p;
    if(res.last_sale) p = res.last_sale.total_price / 1e18;
    else p = -1;
    setLastPrice(p);
    if(res.orders && res.orders[0]) p = res.orders[0].base_price / 1e18;
    else p = -1;
    setPrice(p);
  }

  useState(() => {
    getPrices();
  }, []);

  return (
    <div>
        <div className={styles['data']}>
          <h5>{rank}. City #{id}</h5>
          <h5>Money: ${money}</h5>
          <h5>Income: ${income}</h5>
          <h5 onClick={setExpanded}>Click to expand!</h5>
        </div>
        {
          expanded && <>
            buy: <a href={`https://opensea.io/assets/${address}/${id}`} target='_blank'>See on Opensea</a> <br />
            {price>0 && <>price: {price} ETH<br /></>}
            City image and other stats...
            {/* Ideja je da se tu prikazu jos one "special" gradjevine u listi i da se prikaze 3d model grada koji se vrti (to sa three.js bibliotekom) */}
          </>
        }
    </div>
  )
}

export default Leaderboard_item