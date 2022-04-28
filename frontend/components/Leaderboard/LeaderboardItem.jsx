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
              <span>{price.message} (icon)</span>
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
              data about the cosmetic stuff
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardItem