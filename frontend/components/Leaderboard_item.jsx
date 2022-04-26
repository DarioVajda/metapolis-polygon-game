import React, { useEffect, useState } from 'react'
import styles from './styles/item.module.css'
// import Link from 'next/link'

const Leaderboard_item = ({ id, rank, expanded, setExpanded }) => {
  const [price, setPrice] = useState({});
  const [city, setCity] = useState({});

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

  const getCityData = async () => {
    let element = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    // console.log(id, element);
    setCity(element);
  }

  const highestOffer = async () => {
    const options = {method: 'GET'};
    let res;
    await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id}/offers`, options)
    .then(response => response.json())
    .then(response => res = response)
    .catch(err => console.error(err));
      
    // console.log(id, res);
    
    let p = -1;
    let t;
    let max = -1;
    
    let usdPrice;
    res.offers.forEach((offer, index) => {
      usdPrice = offer.payment_token_contract.usd_price * offer.base_price / 1e18;
      if(usdPrice > p) {
        p = usdPrice;
        t = offer.payment_token_contract.symbol;
        max = index;
      }
    });
    let temp = p / res.offers[max].payment_token_contract.usd_price;

    return { 
      price: Math.round(temp * 1000) / 1000,
      token: t, 
      usdPrice: p, 
      message: 'Highest offer' 
    };
  }
  
  const getListing = async () => {
    const options = {method: 'GET'};
    let res;
    await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id+6}/listings`, options)
      .then(response => response.json())
      .then(response => res = response)
      .catch(err => console.error(err));
      
    if(res.listings.length === 0) return { price: 0, token: 0, usdPrice: '', message: '' };
    
    let temp = res.listings[0].base_price / 1e18;

    return {
      price: Math.round(temp * 1000) / 1000,
      token: res.listings[0].payment_token_contract.symbol,
      usdPrice: temp * res.listings[0].payment_token_contract.usd_price,
      message: 'Price'
    }
  }

  const getPrices = async () => {
    let r;
    
    await highestOffer().then(res => {
      r = res;
    });

    await getListing().then(res => {
      if(res.usdPrice > r.usdPrice) {
        r = res;
      }
    });

    // setTokenSymbol(token);
    if(r.price > 0) setPrice(r);
  }

  useEffect(() => {
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
            {price.price>0 && <>price: {price.price} {price.tokenSymbol} ({price.message})<br /></>}
            City image and other stats...
            {/* Ideja je da se tu prikazu jos one "special" gradjevine u listi i da se prikaze 3d model grada koji se vrti (to sa three.js bibliotekom) */}
          </>
        }
    </div>
  )
}

export default Leaderboard_item