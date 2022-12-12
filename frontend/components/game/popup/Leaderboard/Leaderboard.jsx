import React from 'react'
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion'

import styles from './leaderboard.module.css';

import { ethers } from 'ethers';
import CityContract from '../../../../../smart_contracts/build/contracts/CityContract.json';
import ContractAddress from '../../../../../smart_contracts/contract-address.json';

import { prizes, getRange, price } from '../../../utils/prizes';

import XIcon from '../../../universal/icons/XIcon';
import ScoreIcon from '../../../universal/icons/ScoreIcon';
import OpenIcon from '../../../universal/icons/OpenIcon';
import ArrowIcon from '../../../universal/icons/ArrowIcon';

import Separator from '../../../Leaderboard/Separator';

const Leaderboard = ({ closePopup, data, saveData }) => {

  const showedThreeDots = useRef(false);

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  // #region Loading the NFTs

  const loadNfts = async (data) => {
    // ovo trebam da proverim da li je dobro...
    
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

    let addr = window.ethereum.selectedAddress; // bira se trenutna adresa ili null ako nije connectovan korisnik
    if(!addr) return;


    let numOfNFTs = await city.balanceOf(addr);
    numOfNFTs = numOfNFTs.toNumber();
    // console.log('numOfNFTs:', numOfNFTs);

    let nfts = [];
    
    const delay = async (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    const loadNFT = async (i) => {
      let id;
      id = await city.tokenOfOwnerByIndex(addr, i);
      id = id.toNumber();
      // let _data = await loadData(id);
      // nfts.push({id: id, ..._data});
      // console.log(id);
      nfts.push(id);
    }

    for(let i = 0; i < numOfNFTs; i++) {
      loadNFT(i);
    }

    while(nfts.length < numOfNFTs) {
      // console.log('waiting...', nfts.length, numOfNFTs);
      await delay(100);
    }

    // setNftList([...nfts]);
    console.log(data);
    // saveData(data.map( element => ({ ...element, owned: nfts.includes(element.id) }) )) // use this in the final version, the following is only for testing
    data = Array(100).fill(data).reduce((prev, curr) => [...prev, ...curr], []);
    saveData(data.map( (element, index) => ({ ...element, owned: nfts.includes(element.id) && index % 100 === 0 }) ))
    console.log({ length: data.length });
  }

  // #endregion

  useEffect(() => {
    (async () => {

      // loading the data only if it was not already loaded
      if(data !== false) return;

      // loading the leaderboard list
      let list = await (await fetch('http://localhost:8000/leaderboard')).json();

      // temporarily saving the data before checking the ownership of the items
      saveData(list.map( element => ({ ...element, owned: false }) ));

      // checking if the player owns any of the other cities in the list
      loadNfts(list.map( element => ({ ...element, owned: false }) ));

    })();
  }, []);

  const separatorFunction = (i) => { 
    // funkcija koja vraca podatke o range-u
    let res = getRange(data.length, i);
    return res;
  };

  // #region scrolling to your nft in the list

  const upButton = async () => {
    let list = document.getElementById('leaderboardList');
    // console.log(list);

    // this pixel number indicating where the offset between the bottom of the viewport inside div and its top
    let bottom = Math.floor(list.scrollTop) - 1; 
    // console.log({bottom});

    let first;
    for(let i = data.length - 1; i >= 0; i--) {
      let element = document.getElementById(`leaderboardItem${i}`);
      if(!element) continue;
      
      let tempTop = element.offsetTop - list.offsetTop - element.clientHeight / 2;
      // if(data[i].owned) console.log({i, tempTop})

      if(tempTop < bottom + 1 && data[i].owned) {
        first = i;
        break;
      }
    }

    if(first === undefined) return;
    
    let tempElement = document.getElementById(`leaderboardItem${first}`);
    list.scrollTop = tempElement.offsetTop - list.offsetTop - tempElement.clientHeight / 2;

  }

  const downButton = async () => {
    let list = document.getElementById('leaderboardList');
    // console.log(list);

    // this pixel number indicating where the offset between the bottom of the viewport inside div and its top
    let bottom = Math.ceil(list.scrollTop) + 1; 
    // console.log({bottom});

    let first;
    for(let i = 0; i < data.length; i++) {
      let element = document.getElementById(`leaderboardItem${i}`);
      if(!element) continue;
      
      let tempTop = element.offsetTop - list.offsetTop - element.clientHeight / 2;
      // if(data[i].owned) console.log({i, tempTop});

      if(tempTop > bottom && data[i].owned) {
      // if(i === 0) {
        first = i;
        break;
      }
    }

    if(first === undefined) return;
    
    let tempElement = document.getElementById(`leaderboardItem${first}`);
    // console.log(tempElement);
    // console.log(tempElement.offsetTop);
    // list.scrollTop = tempElement.offsetTop - 4 * tempElement.clientHeight;
    list.scrollTop = tempElement.offsetTop - list.offsetTop - tempElement.clientHeight / 2;
  }

  // #endregion

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Leaderboard
        <XIcon onClick={closePopup} />
      </div>
      <div className={styles.list} id='leaderboardList'>
        <div className={styles.first}>
          <button className={`${styles.upButton} ${false?styles.hideButton:''}`} onClick={upButton}>
            <ArrowIcon direction={0} />
          </button>
        </div>
        {
          data ?
          data.map((element, index) => {
            let r = [];

            let sepData = separatorFunction(index+1);
            r.push(
              // <div key={`separator${index}`}>{index}</div>
              <Separator 
                data={sepData} 
                index={index+1} 
                nfts={data.length} 
                price={price} 
                mini
                key={`separator${index}`} 
              />
            )

            let delta = 1;
            if(
              index < 50 || 
              data
                .slice(index-delta, index+delta+1)
                .reduce((prev, curr) => prev || curr.owned === true, false)
            ) {
              r.push(
                // <motion.div layout key={index} className={`${styles.city} ${element.owned&&index%100==0?styles.ownedCity:''}`}>
                <motion.div layout key={index} className={`${styles.city} ${element.owned?styles.ownedCity:''}`} id={`leaderboardItem${index}`}>
                  <span>
                    {index + 1}
                  </span>
                  <span>
                    City #{element.id}
                  </span> 
                  <span>
                    <ScoreIcon />{element.score}
                  </span>
                  <div>
                    <a href={`city/${element.id}/preview`} target='/blank'>
                      <OpenIcon />
                    </a>
                  </div>
                </motion.div>
              )
              showedThreeDots.current = false;
            }
            else if(showedThreeDots.current === false) {
              r.push(
                <div key={`etc${index}`} className={styles.threeDots}>
                  <span>...</span>
                </div>
              )
              showedThreeDots.current = true;
            }
            
            if(index === sepData.end) {
              r.push(
                <Separator 
                  end 
                  mini
                  data={sepData} 
                  key={`endseparator${index}`} 
                />
              );
              showedThreeDots.current = false;
            }

            return r;
          }) :
          Array(20)
            .fill(null)
            .map((element, index) => index)
            .sort((a, b) => Math.round(Math.random() * 2 - 1))
            .map((element) => (
              <motion.div layout key={element} className={styles.city}>
                <span>City</span>
                <span><ScoreIcon /></span>
              </motion.div>
            ))
        }
        <div className={styles.last}>
          <button className={`${styles.downButton} ${false?styles.hideButton:''}`} onClick={downButton}>
            <ArrowIcon direction={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard