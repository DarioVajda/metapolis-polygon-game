import React from 'react'
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { SpinnerCircular } from 'spinners-react';

import ContractAddress from '../../../smart_contracts/contract-address.json';
import CityContract from '../../../smart_contracts/build/contracts/CityContract.json';

import styles from './mergeUI.module.css';

import { cityInfo } from '../game/htmlContent/cityInfo';

import MergeIcon from '../universal/icons/MergeIcon';
import AddIcon from '../universal/icons/AddIcon';
import { useBuildingStore } from '../game/BuildingStore';

const City = ({ data, id, left, setPopup }) => {

  let canOpenPopup = setPopup(true);
  // console.log({canOpenPopup});

  if(id === undefined) {
    return (
      <div className={`${styles.city} ${left?styles.leftCity:styles.rightCity}`}>
        <span className={styles.cityTitle}>
          Add City
        </span>
        <button className={`${styles.chooseCity} ${canOpenPopup?'':styles.addButtonInactive}`} onClick={() => setPopup()}>
          Choose
          {
            canOpenPopup ?
            <AddIcon /> :
            <SpinnerCircular size='1em' thickness={200} color='#fff' secondaryColor='transparent' />
          }
        </button>
      </div>
    )
  }
  else if(!data) {
    return (
      <div className={`${styles.city} ${left?styles.leftCity:styles.rightCity}`}>
        Loading the data...
      </div>
    )
  }
  else return (
    <div className={`${styles.city} ${left?styles.leftCity:styles.rightCity}`}>
      <span className={styles.cityTitle}>City #{id}</span>
      {cityInfo.money(data)}
      {cityInfo.income(data)}
      {cityInfo.educated(data)}
      {cityInfo.normal(data)}
    </div>
  )
}

const MergeButton = ({ id1, id2 }) => {

  let both = id1 !== undefined && id2 !== undefined;
  let none = id1 === undefined && id2 === undefined;

  if(none) return null;

  return (
    <button className={`${styles.mergeButton} ${both?'':styles.mergeButtonInactive}`}>
      Merge
      <MergeIcon />
    </button>
  )
}

const MergeUI = ({ id1, id2 }) => {
  
  const [ nfts, setNfts ] = useState(false) // false - not loaded, [ ... ] the ids of the cities that the person owns

  const [ data1, setData1 ] = useState(false); // false - not loaded, {...CityData} - loaded
  const [ data2, setData2 ] = useState(false); // false - not loaded, {...CityData} - loaded

  const popup = useBuildingStore(state => state.popup);
  const setPopup = useBuildingStore(state => state.setPopup);

  // console.log(id1, id2);

  // #region Loading the NFTs

  const loadNfts = async () => {
    let addr = window.ethereum.selectedAddress;
    console.log({addr});
    if(!addr) return false;
    
    const abi = CityContract.abi;
    const contractAddress = ContractAddress.city;
    let provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
    );
    let city = new ethers.Contract(
      contractAddress,
      abi,
      provider
    )
    let numOfNFTs = await city.balanceOf(addr);
    numOfNFTs = numOfNFTs.toNumber();
    // console.log('numOfNFTs:', numOfNFTs);

    let _nfts = [];
    
    const delay = async (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    const loadNFT = async (i) => {
      let id;
      id = await city.tokenOfOwnerByIndex(addr, i);
      id = id.toNumber();
      let _data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
      _nfts.push({id: id, ..._data});
    }

    for(let i = 0; i < numOfNFTs; i++) {
      loadNFT(i);
    }

    while(_nfts.length < numOfNFTs) {
      console.log('waiting...', _nfts.length, numOfNFTs, _nfts);
      await delay(250);
    }
    
    console.log('done', _nfts);
    setNfts([..._nfts]);
  }

  useEffect(() => {
    // loading the NFTs  
    loadNfts();  
  }, []);
  
  // #endregion

  // #region fetching the data

  const fetchData = async (id) => {
    let res = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    console.log(id, res);

    if(id === id1) {
      setData1(res);
    }
    else if(id === id2) {
      setData2(res);
    }
  }

  useEffect(() => {

    setPopup({});

    if(id1 !== undefined && data1 === false) {
      fetchData(id1);
    }
    if(id2 !== undefined && data2 === false) {
      fetchData(id2);
    }
  }, [ id1, id2 ]);

  // #endregion

  const setPopupFunction = (test) => {
    if(nfts === false) return false;

    if(test) return true;
    setPopup({ 
      type: 'choose-city', 
      first: id1 === undefined ? id2 : id1,
      nfts: nfts
    });
  }

  return (
    <div className={styles.wrapper}>
      <City data={data1} id={id1} setPopup={setPopupFunction} left />
      <MergeButton id1={id1} id2={id2} />
      <City data={data2} id={id2} setPopup={setPopupFunction} />
    </div>
  )
}

export default MergeUI