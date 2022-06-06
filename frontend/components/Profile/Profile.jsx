import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import CityContract from '../../../smart_contracts/build/contracts/CityContract.json';
import ContractAddress from '../../../smart_contracts/contract-address.json';

import City from './City'

import styles from './profile.module.css'

const Sort = (setSort) => {

  const [showPopup, setShowPopup] = useState(false); // false - don't show the popup, true - show the popup


  // <div className={`${styles.popup} ${showPopup?'':styles.hidePopup}`}>
  // </div>

  // <div className={styles.sort}>
  //       <div className={styles.sortBtn}>
  //         <span>
  //           {'Score: High to Low'}
  //         </span>
  //         <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  //           <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
  //         </svg>
  //       </div>
  //       <div className={styles.sortOptions}>
  //         <div>
  //           {'Score: High to Low'}
  //         </div>
  //         <div>
  //           {'Score: High to Low'}
  //         </div>
  //         <div>
  //           {'Score: High to Low'}
  //         </div>
  //       </div>
  //     </div>

  return (
    <div className={styles.sortWrapper}>
      <div className={styles.sort}>
        <div className={`${styles.sortBtn} ${showPopup?styles.popupShown:''}`} onClick={() => setShowPopup(!showPopup)} >
          <span>
            {'Score: High to Low'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
          </svg>
        </div>
        <div className={`${styles.sortOptions} ${showPopup?'':styles.hidePopup}`}>
          <div>
            {'Score: High to Low'}
          </div>
          <div>
            {'Score: High to Low'}
          </div>
          <div>
            {'Score: High to Low'}
          </div>
          <div>
            {'treba napraviti...'} {/* ...da se strelica okrene nagore kad se otvori popup */}
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = ({ addr, isOwner }) => {

  const [username, setUsername] = useState('username100');
  const [nftList, setNftList] = useState(false); // false - not loaded, [] - empty, [...] - indexes of the NFTs the person owns

  const sortTypes = {
    Desc: () => {
      // funkcija koja sortira gradove po score-u u opadajucem redosledu
    },
    desc: 'Desc',
    Asc: () => {
      // funkcija koja sortira gradove po score-u u rastucem redosledu
    },
    asc: 'Asc',
    LastEdited: () => {
      // funkcija koja sortira gradove po tome koji je kad editovan (ne znam jos kako cu i da li cu uraditi ovo)
    },
    lastEdited: 'LastEdited',
  }
  const [sort, setSort] = useState(sortTypes.desc);
  console.log(sortTypes);

  const formatAddr = () => {
    let r = '';
    for(let i = 0; i < 6; i++) r = r + addr[i];
    r = r + '...';
    for(let i = addr.length-4; i < addr.length; i++) r = r + addr[i];

    return r;
  }

  // #region Loading the NFTs

  const loadNfts = async () => {
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

    console.log(sort);
    sortTypes[sort].call(); // poziva se funkcija koja sortira grad po izabranom kriterijumu
    setNftList(nfts);
  }

  // #endregion

  useEffect(() => {
    loadNfts();
  }, []);

  if(nftList === false) return (
    <div>Loading...</div>
  )
  else return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={styles.image}
        >
          <g fill="currentColor"><path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></g>
        </svg>
      </div>
      <div className={styles.username}>
        <a href={`http://opensea.io/${addr}`} target="_blank" rel="noopener noreferrer">
          {username}
        </a>
      </div>
      <div className={styles.addr}>
        <svg 
          className={styles.eth}
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true" 
          role="img" 
          height="1.2em" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox="0 0 256 417"
        >
          <path fill="var(--eth-left2)" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
          <path fill="var(--eth-left1)" d="m.001 212.321l127.96 75.637V154.159z"/>
          <path fill="var(--eth-left2)" d="M127.962 416.905v-104.72L0 236.585z"/>
          <path fill="var(--eth-right2)" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/>
          <path fill="var(--eth-right1)" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/>
          <path fill="var(--eth-right2)" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.601l128.038-180.32z"/>
        </svg>
        <svg 
          className={styles.matic}
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true" 
          role="img" 
          height="1.2em" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox="0 0 32 32"
        >
          <path fill="var(--matic)" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16S7.163 0 16 0zm-5.13 7.662l-4.243 2.372A1.16 1.16 0 0 0 6 11.076v4.78c0 .432.221.827.627 1.043l4.244 2.372c.369.215.849.215 1.254 0l2.879-1.618l1.955-1.114l2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.37.215.627.61.627 1.042v2.552c0 .431-.22.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.255 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .431.221.827.627 1.042l4.244 2.372c.369.216.848.216 1.254 0l4.244-2.372c.369-.215.627-.61.627-1.042v-4.78a1.16 1.16 0 0 0-.627-1.042l-4.28-2.409c-.37-.215-.85-.215-1.255 0l-2.879 1.654l-1.955 1.078l-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653a1.16 1.16 0 0 0-.627-1.042l-4.17-2.372c-.369-.216-.848-.216-1.254 0z"/>
        </svg>
        <a href={`http://polygonscan.com/address/${addr}`} target="_blank" rel="noopener noreferrer">
          {formatAddr()}
        </a>
      </div>
      <Sort setSort={setSort} />
      <div className={styles.nftlist}>
        {
          nftList.map((id, index) => (
            <div key={index}>
              <City id={id} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Profile