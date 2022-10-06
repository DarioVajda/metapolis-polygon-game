import React, { useEffect, useRef, useState } from 'react'

import style from './leaderboard.module.css';

import MoneyIcon from '../universal/icons/MoneyIcon';
import IncomeIcon from '../universal/icons/IncomeIcon';
import ScoreIcon from '../universal/icons/ScoreIcon';
import OpenseaIcon from '../universal/icons/OpenseaIcon';
import Placeholder from '../universal/icons/achievement_icons/Placeholder';

import City from '../universal/city/City';

import Hover from '../universal/hover/Hover';

import { achievements } from '../achievements/achievements';

import { cityValue } from '../../../server/gameplay/cityValue';

const compareProps = (prev, curr) => {
  return prev.expanded === curr.expanded && prev.owned === curr.owned
}

const LeaderboardItemLoading = ({ index }) => {
  
  return (
    <div className={style.item}>
      <div className={style.top}>
        <div className={style.owner}>
          <img src={`https://storage.googleapis.com/opensea-static/opensea-profile/${10}.png`} />
        </div>
        <div className={style.id}>
          <span>{index+1}</span>
        </div>
        <div className={style.arrow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

const LeaderboardItem = React.memo(({ index, id, expanded, loadCity, expand, owned, nfts, specialTypeData }) => {

  if(id === -1) return <LeaderboardItemLoading index={index} />

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'; // the address of the contract (for opensea api call)

  const [info, setInfo] = useState({
    data: false,
    price: {},
    people: false,
    owner: { randomIndex: Math.floor(Math.random() * 33) + 1 }  // { randomIndex: ... } - not loaded, { data... } - contains data about the owner of the NFT
  });

  // #region Getting the prices


  const highestOffer = async (id) => {

    const options = { method: 'GET' };
    let res;
    await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id}/?include_orders=true`, options)
      .then(response => response.json())
      .then(response => res = response)
      .catch(err => console.error(err))
    
    if(res === undefined) return {
      price: 0,
      token: '',
      usdPrice: 0,
      message: 'Error'
    }
    
    let p = -1; // najveca cena u dolarima
    let t; // simbol tokena
    let max = -1; // cena izrazena u tom tokenu
    
    let usdPrice;
    let tokens = {}; // lista podataka o tokenima koji se koriste
    res.collection.payment_tokens.forEach((element) => {
      tokens[element.address] = { symbol: element.symbol, price: element.usd_price, decimals: element.decimals }
    })

    res.seaport_sell_orders.forEach((offer, index) => {

      let token = tokens[offer.protocol_data.parameters.offer[0].token.toLowerCase()];
      // if(id === 0) console.log(token);
      
      if(token === undefined) {
        // console.log({id, token, index, addr: offer });
      }
      else { usdPrice = offer.current_price / Math.pow(10, token.decimals) * token.price; } // racuna se cena u dolarima
      
      if(usdPrice > p) {
        p = usdPrice;
        t = token.symbol;
        max = offer.current_price / Math.pow(10, token.decimals);
      }
      
    });
    // if(id === 0) console.log({tokens});

    let r = { 
      price: Math.round(max * 1000) / 1000,
      token: t, 
      usdPrice: p, 
      message: 'Highest offer' 
    };
    // console.log(r);
    return r;
  }
  
  const getListing = async (id) => {
    const options = {method: 'GET'};
    let res;
    await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id}/listings`, options)
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
    
    await highestOffer(id).then(res => {
      r = res;
    });

    // await getListing(id).then(res => {
    //   if(res.usdPrice > r.usdPrice) {
    //     r = res;
    //   }
    // });

    // setTokenSymbol(token);
    return r;
  }
  // #endregion

  // #region Getting the data
  const getData = async () => {
    let res = await loadCity(id, index);
    let _people = calculatePeople(res);
    let _price = await getPrices();
    let _owner = await getOwnerData(res.owner);
    // console.log({achievementList: res.achievementList})
    setInfo({
      data: res,
      people: _people,
      price: _price,
      owner: _owner
    });
  }

  useEffect(() => {
    getData();
  }, []);

  // #endregion

  // #region Working with the data
  const calculatePeople = (_data) => {

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

    return _people;
  }

  // #endregion

  // #region People functions

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

  // #region Profile image

  const getOwnerData = async (addr) => {
    const options = {method: 'GET'};

    // kasnije nece trebati nista od sledeceg api call-a (nego se koristi prosledjena vrednost od 'addr')
    let assetRes;
    await fetch(`https://api.opensea.io/api/v1/asset/${address}/${id}/`, options)
      .then(response => response.json())
      .then(response => assetRes = response)
      .catch(err => console.error(err));
    addr = assetRes.owner.address;

    let res;
    await fetch(`https://api.opensea.io/user/${addr}`, options)
      .then(response => response.json())
      .then(response => res = response)
      .catch(err => console.error(err));

    // console.log(id, 'response:', res);

    // setOwner(res.account);
    return res.account;
  }

  // #endregion

  // #region Setting the expanded index

  const setExpanded = (index) => {
    if(info.data) {
      expand(index)
    }
  }

  // #endregion

  let data   = info.data;
  let price  = info.price;
  let people = info.people;
  let owner  = info.owner;

  console.log(id);

  return (
    <div className={style.item}>
      <div className={`${style.top} ${owned?style.topOwned:''}`} onClick={() => setExpanded(index)}>
        <div className={style.owner}>
          {
            owner.randomIndex === undefined ?
            <a href={`/profile/${owner.address}`} onClick={(event) => event.stopPropagation()} >
              <img src={owner.profile_img_url} alt="" />
              {
                owner.user.username &&
                <span>{owner.user.username}</span>
              }
            </a> :
            <img src={`https://storage.googleapis.com/opensea-static/opensea-profile/${owner.randomIndex}.png`} />
          }
        </div>
        <div className={style.id}>
          <span>{index+1}</span> City #{id!==-1 && id}
        </div>
        {
          data.money !== undefined && 
          <div className={style.money}>
            <MoneyIcon />
            {data.money.toLocaleString('en-US')}
          </div> 
        }
        {
          data.income !== undefined &&
          <div className={style.income}>
            <IncomeIcon />
            {data.income.toLocaleString('en-US')}
          </div>
        }
        <div className={`${style.arrow} ${expanded&&style.arrowUp}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
          </svg>
        </div>
      </div>
      <div className={`${style.more} ${!expanded?style.hide:''}`}>
        <div className={style.city}>
          <div>
            { expanded && <City dataArg={data} rotation={5} /> }
          </div>
        </div>
        <div className={style.data}>
          <div className={style.dataTop}>
            <a href={`https://opensea.io/assets/${address}/${id}`} target='_blank' className={style.price}>
              <span>
                <OpenseaIcon size={1} />
                <span>{price.message}</span>
              </span>
              <div>{price.price} {price.token}</div>
            </a>
            <div className={style.score}>
              <div>
                <ScoreIcon size={1.15} /> 
                <span>{data.money?(data.money + 7*data.income).toLocaleString('en-US'):0}</span>
              </div>
              <span>
                Score = money + 7*income
              </span>
            </div>
            <div className={style.totalValue}>
              <span>City value:</span>
              ${cityValue(data, specialTypeData).toLocaleString('en-US')}
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
            <div className={style.achievementSection}>
              {
                data.achievementList && [...data.achievementList ].map((element, index) => (element.completed || true) && ( // kasnije treba skloniti ono '|| true'
                  <div key={index} className={style.achievementBadge} style={{zIndex: 10+index}}>
                    <Hover info={achievements[element.key].explanation} childWidth='20em' specialId={`${element.key}${index}`} sidePadding={'1.5em'} >
                      { achievements[element.key].achievementIcon({ size:5, unit:'em', hoverable: true }) }
                    </Hover>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, compareProps)

export default LeaderboardItem