import React, { useState } from 'react'

const Leaderboard_item = ({ id, income, money, rank }) => {
  const [lastPrice, setLastPrice] = useState(0);
  const [price, setPrice] = useState(0);

  const getPrices = async () => {
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/${id+4000}/`)).json();
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
        <p>
          City #{id} <br />
          money: {money} <br />
          income: {income} <br />
          {price>0 && <>price: {price} ETH<br /></>}
          {lastPrice>0 && <>last price: {lastPrice} ETH<br /></>}
          rank: {rank} <br />
          {/* opensea: <Link href='opensea.com'></Link> */}
        </p>
    </div>
  )
}

export default Leaderboard_item