import React, { useEffect } from 'react'
import { useState } from 'react';

import { ethers } from 'ethers';
import { SpinnerCircular } from 'spinners-react';
import { motion } from 'framer-motion';

import styles from './makeOffer.module.css';

import { useBuildingStore } from '../BuildingStore';

import XIcon from '../../universal/icons/XIcon';
import MoneyIcon from '../../universal/icons/MoneyIcon';
import ArrowIcon from '../../universal/icons/ArrowIcon';
import TrashIcon from '../../universal/icons/TrashIcon';

import { specialPrices } from '../../../../server/gameplay/building_stats';

const RemoveIcon = ({onClick}) => {
  const [ canceling, setCanceling ] = useState(false);

  const onClickFunc = () => {
    onClick(setCanceling);
  }

  return (
    canceling === false ?
    <div onClick={onClickFunc}>
      <TrashIcon />
    </div> :
    <div style={{ transform: 'scale(.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'auto' }}>
      <SpinnerCircular size='1em' thickness={200} color='#fff' secondaryColor='transparent' />
    </div>
  )
}

const MakeOffer = ({ closePopup, type }) => {

  const { id } = useBuildingStore(state => state.staticData);
  const { money } = useBuildingStore(state => state.dynamicData);
  const specialTypeData = useBuildingStore(state => state[`type_${type}`]);  
  const changeSpecialBuildingData = useBuildingStore(state => state.changeSpecialBuildingData);
  const setPopup = useBuildingStore(state => state.setPopup);

  const [ number, setNumber ] = useState('');
  const [ showingAll, setShowingAll ] = useState(false);
  const [ makingOffer, setMakingOffer ] = useState(false);
  const [ filterList, setFilterList ] = useState(false);
  // const [ canceling, setCanceling ] = useState([]);

  const checkChange = (e) => {
    const re = /^[0-9\b]+$/;
    if ((e.target.value === '' || re.test(e.target.value)) && e.target.value < 1e9 && (e.target.value != 0 || e.target.value === '')) {
      setNumber(e.target.value);
    }
  }

  // #region realoading the data

  useEffect(() => {
    let componentActive = true;

    const delay = async (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }
    
    const reloadData = async () => {
      while(true) {
        // waiting random amount of time until the next iteration
        await delay(4000 * (1 + Math.random()));

        // breaking if the component was destroyed in the meantime
        if(componentActive === false) {
          // console.log('break');
          break;
        }
        
        // loading the new data
        let _data = await (await fetch(`http://localhost:8000/specialtype/${type}`)).json();
        // console.log(_data);
        changeSpecialBuildingData(_data, type);
      }
    }
    reloadData();

    return () => {
      componentActive = false;
    }
  }, []);

  // #endregion

  // #region

  const confirmOffer = async () => {
    if(number < specialPrices.get(type)) {
      return;
    }
    if(number > money) {
      return;
    }
    if(makingOffer) {
      return;
    }

    if(!window.ethereum) {
      setPopup({
        message: 'User does not have the Metamask extensions installed',
        type: 'error-popup-widget'
      });
      return;
    }

    const message = `Make offer for a ${type} as the owner of the City #${id} (unique ID - ${Math.floor(Math.random()*999999999)})`;

    setMakingOffer(true);

    let signature;
    try {
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      signature = await signer.signMessage(message);
    } 
    catch (error) {
      setMakingOffer(false);
      setPopup({ 
        message: error.message, 
        type: 'error-pupup-msg' 
      });
      return;
    }

    const body = {
      signature,
      message,
      value: number,
      type
    };

    const response = await fetch(`http://localhost:8000/cities/${id}/specialoffer`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: { 
        "Content-Type": "application/json" 
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(body),
    });
    setMakingOffer(false);
    setNumber('');
    
    console.log(response);
  }

  const cancelOffer = async (value, setCanceling) => {

    if(!window.ethereum) {
      setPopup({
        message: 'User does not have the Metamask extensions installed',
        type: 'error-popup-widget'
      });
      return;
    }

    const message = `Canceling the offer with value ${value} (unique ID - ${Math.floor(Math.random()*999999999)})`;

    // setCanceling([...canceling, value]);
    setCanceling(true);

    let signature;
    try {
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      signature = await signer.signMessage(message);
    } 
    catch (error) {
      // let offerIndex = canceling.indexOf(value);
      // setCanceling(canceling.filter((element, i) => i !== offerIndex));
      setCanceling(false);
      // setPopup({ 
      //   message: error.message, 
      //   type: 'error-pupup-msg' 
      // });
      return;
    }

    const body = {
      signature,
      message,
      value,
      type
    };

    const response = await fetch(`http://localhost:8000/cities/${id}/canceloffer`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: { 
        "Content-Type": "application/json" 
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(body),
    });

    // removing the offer from the list of offers that are being canceled
    // let offerIndex = canceling.indexOf(value);
    // setCanceling(canceling.filter((element, i) => i !== offerIndex));
    
    console.log(response);
  }

  // #endregion

  // console.log(showingAll);
  // console.log(number > money);

  // calculating how many offers are higher than the money value in the input field
  let offers = specialTypeData.offers.filter(element => element.filled === false);
  console.log(specialTypeData.offers, offers);
  let above = offers.reduce((prev, curr) => prev + (curr.value > number ? 1 : 0), 0);
  let highestOffer = offers.reduce((prev, curr) => curr.value > prev.value ? curr : prev, { value: 0 });
  return (
    <div className={`${styles.wrapper} ${showingAll?styles.showingAll:''}`}>
      <div className={styles.topData}>
        <span>Make Offer for a {type}</span>
        <XIcon size={1} onClick={closePopup} />
      </div>
      <div className={styles.form}>
        <div className={styles.offerMessage}>
          Min. offer: {specialPrices.get(type)}
        </div>
        <div className={styles.input}>
          <div>
            <MoneyIcon />
            <input value={number} placeholder="Enter value..." onChange={checkChange} type="text" />
          </div>
          <button 
            className={`${styles.activeConfirmButton} ${number < specialPrices.get(type) || number > money ? styles.inactiveConfirmButton : ''} ${makingOffer ? styles.progressConfirmButton : ''}`}
            onClick={confirmOffer}
          >
            {
              makingOffer &&
              <SpinnerCircular size='.8em' thickness={200} color='#fff' secondaryColor='transparent' />
            }
            Confirm
          </button>
        </div>
        <div className={styles.offerMessage}>
          There will be {above} offers with higher priority
        </div>
      </div>
      <div className={styles.highestOffer}>
        {
          specialTypeData.offers.length > 0 ?
          <>
            Highest offer is {highestOffer.value}, by the City #{highestOffer.user}
          </> :
          <>
            There are no offers
          </>
        }
      </div>
      <div className={styles.showOffers}>
        <div onClick={() => setShowingAll(!showingAll)} >
          <ArrowIcon direction={2} size={2} />
          All Offers
        </div>
        <label>
          <input 
            type="checkbox" 
            value={filterList}
            onChange={() => setFilterList(state => !state)}
          />
          Filter
        </label>
      </div>
      <div className={styles.offerList}>
        <div />
        {
          Array(1)
            .fill(offers)
            .reduce((prev, curr) => [...prev, ...curr], [])
            .sort((a, b) => b.value - a.value)
            // .filter(element => filterList === false || element.user == id)
            .map((element, index) => {
              if(element.user != id && filterList === true) return null;
              else if(element.user == id) return (
                <motion.div layout key={`${element.user}_${element.value}`}>
                  <div className={styles.offerMaker}>
                    <RemoveIcon onClick={(setCanceling) => cancelOffer(element.value, setCanceling)} />
                    <span>
                      City #{element.user}
                    </span>
                    <span>
                      <MoneyIcon/>
                      {(element.value).toLocaleString('en-US')}
                    </span>
                  </div>
                </motion.div>
              )
              else return (
                <motion.div layout key={`${element.user}_${element.value}`}>
                  <span>
                    City #{element.user}
                  </span>
                  <span>
                    <MoneyIcon/>
                    {(element.value).toLocaleString('en-US')}
                  </span>
                </motion.div>
              )
            })
        }
        <div />
      </div>
      <div className={styles.explanation} >
        * When someone sells their {type} through an offer, the HIGHEST available offer is ALWAYS 
        going to be fulfilled. To boost your chances of getting your offer accepted as fast as possible 
        make sure bid with a higher price, but always think about the (in-game) economics in the situation!
      </div>
      <div />
    </div>
  )
}

export default MakeOffer