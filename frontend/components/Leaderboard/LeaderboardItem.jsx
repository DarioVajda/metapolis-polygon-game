import React, { useEffect, useRef, useState } from 'react'

import style from './leaderboard.module.css';

const LeaderboardItem = ({ index, id, expanded, loadCity, expand }) => {

  const [data, setData] = useState(false);
  const idLoaded = useRef(false);
  const dataLoaded = useRef(false);

  const [price, setPrice] = useState({});
  const [people, setPeople] = useState(false);

  // #region Getting the prices

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

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
  // #endregion

  // #region Getting the data
  const getData = async () => {
    loadCity(id, index).then(res => {
      if(dataLoaded.current) return;

      // console.log(res);
      idLoaded.current = true;
      calculatePeople(res);
      setData(res);
      dataLoaded.current = true;
      getPrices();
    });
  }

  if(idLoaded.current === false && id >= 0) {
    getData();
  }

  // #endregion

  // #region Working with the data
  const calculatePeople = (_data) => {

    // ...
    // this data should be pulled from somewhere or calculated here...
    // ...
    console.log(_data);

    let _people = {
      educated: _data.educated,
      normal: _data.normal,
      educatedWorkers: _data.educatedWorkers,
      normalWorkers: _data.normalWorkers
    };

    let educatedRemainder = _people.educated - _people.educatedWorkers; // the number of educated people not having an adequate job
    if(educatedRemainder < 0) educatedRemainder = 0;
    _people.educatedRemainder = educatedRemainder;

    let educatedHelping = _people.normalWorkers - _people.normal; // the number of educated people helping as manual workers
    if(educatedHelping < 0) educatedHelping = 0; // in this case there is no need for help
    if(educatedHelping > educatedRemainder) educatedHelping = educatedRemainder; // in this case there are not enough educated people to help fill all the workplaces
    _people.educatedHelping = educatedHelping

    setPeople(_people);
  }

  // #endregion

  // #region Util functions

  const percentage = (t) => {
    // true -> educated, false -> normal
    let _people = t?people.educated:people.normal;
    let _workers = t?people.educatedWorkers:people.normalWorkers;
    let _spareEducatedWorkers = t?0:people.educated-people.educatedWorkers;
    if(_spareEducatedWorkers < 0) _spareEducatedWorkers = 0;

    _people = _people + _spareEducatedWorkers;

    if(_people / _workers > 1) return '100%';
    // if(_people / _workers > 1) return `${100 * _workers / _people}%`;
    else return `${100 * _people / _workers}%`;
  }

  const color = (t) => {
    // true -> educated, false -> normal
    let _people = t?people.educated:people.normal;
    let _workers = t?people.educatedWorkers:people.normalWorkers;

    if(t) {
      _people -= people.educatedHelping;
    }
    else {
      _people += people.educatedHelping;
    }

    if(Math.abs(1 - _people / _workers) > 0.4) return 'red';
    else if(Math.abs(1 - _people / _workers) > 0.15) return 'yellow';
    else return 'green';
  }

  const uneducatedPeopleMessage = () => {
    let message = 'Some text1...';

    if(people.educatedHelping > 0) {
      if(people.educatedHelping + people.normal < people.normalWorkers) {
        if(people.educatedHelping > 1) {
          message = `${people.educatedHelping} educated people work as manual workers, but the city still needs ${people.normalWorkers - (people.normal + people.educatedHelping)} more manual worker${people.normalWorkers - (people.normal + people.educatedHelping)===1?'':'s'}.`;
        }
        else {
          message = `1 educated person works as a manual worker, but the city still needs ${people.normalWorkers - (people.normal + people.educatedHelping)} more manual worker${people.normalWorkers - (people.normal + people.educatedHelping)===1?'':'s'}.`;
        }
      }
      else {
        if(people.educatedHelping > 1) {
          message = `${people.educatedHelping} educated people work as manual workers and now there are exactly enough manual workers.`;
        }
        else {
          message = `1 educated person works as a manual worker and now there are exactly enough manual workers.`;
        }
      }
    } 
    else { // no educated people are working as manual workers
      if(people.normal > people.normalWorkers) {
        message = `There are ${people.normal-people.normalWorkers} people doing nothing while waiting for a job as manual workers.`
      }
      else if(people.normal - people.normalWorkers === 1) {
        message = 'There is 1 person doing nothing while waiting for a job as a manual worker.';
      }
      else if(people.normal === people.normalWorkers) {
        message = 'There are exactly enough manual workers in the city.';
      }
      else if(people.normalWorkers - people.normal === 1) {
        message = 'The city needs 1 more manual worker.';
      }
      else {
        message = `The city needs ${people.normalWorkers - people.normal} manual workers.`;
      }
    }

    return message;
  }

  const educatedPeopleMessage = () => {
    let message = '';
    
    if(people.educatedRemainder > 1) {
      if(people.educatedHelping > 0) {
        message = `There are ${people.educatedRemainder} educated people more than needed, ${people.educatedHelping===people.educatedRemainder?'all':people.educatedHelping} of them are working as manual workers${people.educatedRemainder===people.educatedHelping?'':', while others are doing nothing'}.`
      }
    }
    else if(people.educatedRemainder === 1) {
      message = `There is 1 educated person more than needed, he is ${people.educatedHelping>0?'working as manaul worker':'doing nothing'}.`
    }
    else if(people.educated - people.educatedWorkers === 0) {
      message = 'There are exactly enough educated people in the city.';
    }
    else {
      message = `The city needs ${people.educatedWorkers-people.educated} more educated worker${people.educatedWorkers-people.educated===1?'':'s'}.`;
    }

    return message;
  }

  // #endregion

  useEffect(() => {
    // calculatePeople();
  }, []);

  return (
    <div className={style.item}>
      <div className={style.top} onClick={() => expand(index)}>
        <div className={style.id}>
          {index+1}. City #{id!==-1 && id}
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
        <div className={style.city}>
          city
        </div>
        <div className={style.data}>
          <div className={style.dataTop}>
            <a href={`https://opensea.io/assets/${address}/${id}`} target='_blank' className={style.price}>
              <span>
                {price.message}
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12s12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081l3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528c-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199a.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962c-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132c-.026.226.017.459.125.67c.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992c.156-.274.308-.566.43-.86c.024-.052.043-.107.065-.16c.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787c0-.108-.004-.221-.014-.327c-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312a6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972a5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197a4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05l.192.054l.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202a.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017c.034.024.084.062.147.11c.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691c.065.074.127.146.192.226c.062.079.132.156.19.232c.079.104.16.212.235.324c.033.053.074.108.105.161c.096.142.178.288.257.435c.034.067.067.141.096.213c.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254c-.075.17-.161.343-.264.502c-.034.06-.075.122-.113.182c-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209c-.081.098-.16.19-.245.278c-.048.058-.1.118-.156.17c-.052.06-.108.113-.156.161c-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298c.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z"/></svg>
              </span>
              <div>{price.price} {price.token}</div>
            </a>
            <div className={style.score}>
              Score: {data.money?data.money + 7*data.income:0}
              <div>
                Score = money + 7*income
              </div>
            </div>
            <div className={style.totalValue}>
              City value: ${1234321}
            </div>
          </div>
          <div className={style.stats}>
            <div className={style.peopleSection}>
              <div className={style.people}>
                Uneducated ({people.normal}{people.educatedHelping>0?`+${people.educatedHelping}`:''}/{people.normalWorkers})
                <div className={style.peopleBar}>
                  <div className={style.peopleBarFill} style={{height: '100%', width: percentage(false), backgroundColor: color(false)}}>
                    <span>
                      {uneducatedPeopleMessage()}
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.people}>
                Educated ({people.educated}/{people.educatedWorkers})
                <div className={style.peopleBar}>
                  <div className={style.peopleBarFill} style={{height: '100%', width: percentage(true), backgroundColor: color(true)}}>
                    <span>
                      {educatedPeopleMessage()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardItem