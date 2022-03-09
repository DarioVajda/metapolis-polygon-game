import React, { useState } from 'react'
import styles from './styles/item.module.css'
// import Link from 'next/link'

const Leaderboard_item = ({ id, rank, expanded, setExpanded }) => {
  const [lastPrice, setLastPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('ETH');
  const [city, setCity] = useState({});

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

  const getCityData = async () => {
    let element = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    // console.log(id, element);
    setCity(element);
  }

  const getPrices = async () => {
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id}/`)).json();
    var p;

    // console.log(res);
    if(res.last_sale) p = res.last_sale.total_price / 1e18;
    else p = -1;
    setLastPrice(p);

    var tokenSymbol = 'ETH';
    if(res.orders && res.orders[0]) {
      let maks = 0;
      for(let i = 0; i < res.orders.length; i++) {
        if(res.orders[i].base_price / 1e18 > res.orders[maks].base_price / 1e18) 
          maks = i;
      }
      p = res.orders[maks].base_price / 1e18;
      tokenSymbol = res.orders[maks].payment_token_contract.symbol;
      // console.log("order:", res.orders[maks]);
    }
    else p = -1;

    setTokenSymbol(tokenSymbol);
    setPrice(p);
  }

  useState(() => {
    getCityData();
    getPrices();
  }, []);

  return (
    <div>
        <div className={styles['data']}>
          <h5>{rank}. City #{id}</h5>
          <h5>Money: ${city.money}</h5>
          <h5>Income: ${city.income}</h5>
          <h5 onClick={setExpanded}>Click to expand!</h5>
        </div>
        {
          expanded && <>
            buy: <a href={`https://opensea.io/assets/${address}/${id}`} target='_blank'>See on Opensea</a> <br />
            {price>0 && <>price: {price} {tokenSymbol}<br /></>}
            City image and other stats...
            {/* Ideja je da se tu prikazu jos one "special" gradjevine u listi i da se prikaze 3d model grada koji se vrti (to sa three.js bibliotekom) */}
          </>
        }
    </div>
  )
}

export default Leaderboard_item