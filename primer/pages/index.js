// NAPOMENA - ovo je uradjeno u nextu a ja jedva znam kako to radi i kakva je praksa sa pisanjem programa, ovo sam samo tako uradio da radi i da se vide javascript funkcije koje se povezuju sa blockchain-om

// da bi ovo funkcionisalo kako treba, moras imati instaliran metamask sa polygon mumbai mrezom (pogledaj na netu kako to da se doda) i test matic tokenima na toj adresi (to se dobija tako sto puno puta pejstuje adresu u 'polygon mumbai faucet' sajt, nadji i to)

import { useState } from 'react' // importovanje react-a

import {ethers} from 'ethers' // importovanje ethers.js biblioteke

import Gameplay from '../../smart_contracts/build/contracts/Gameplay.json'; // importuje se abi
import CityContract from '../../smart_contracts/build/contracts/CityContract.json'; // importuje se abi
// abi je json koji objasnjava sta su argumenti svih funkcija u smart contractu i sta vracaju

import {city as cityContractAddressImport} from '../../smart_contracts/contract-address.json';

var cityContractAddress;
var gameplayContractAddress;

export default function Home() {
  var cityContract;
  var gameplayContract;
  
  async function initCityContract() {
    cityContractAddress = cityContractAddressImport;
    const provider = new ethers.providers.Web3Provider(window.ethereum); // pravi se provider koji daje vezu sa blockchainom
    const signer = provider.getSigner(); // signer koji se daje kao argument pri povezivanju sa contractom
    cityContract = new ethers.Contract(cityContractAddress, CityContract.abi, signer); // povezivanje sa contractom za mintovanje i slicne stvari
    // console.log('cityContract:', cityContract);

    let s = await cityContract.getSaleState(); // dobija se saleState sa blockchaina iz smart contracta
    setSaleState(s); // setuje se vrednost
  }

  async function initGameplayContract() {
    gameplayContractAddress = '0xc20f0dcbe9219d7c1e5b3b6fce1ba6cafe8305d90b09ab202dc11ec3a1dabeaa';
    // ovaj contract ne znam da li ce trebati bilo gde u frontendu, zavisi da li ce se ovo pozivati sa backenda, sto se jos ne zna
    // inace isto funkcionise ova funkcija kao initCityContract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    gameplayContract = new ethers.Contract(gameplayContractAddress, Gameplay.abi, signer);
    // console.log('gameplayContract:', gameplayContract);
  }

  const [balance, setBalance] = useState(); // ove 2 linije su react stvari, trebalo bi da bude logicno sta rade
  const [saleState, setSaleState] = useState(true);

  initCityContract(); 
  initGameplayContract(); // oba se pokrecu cim se napravi stranica, ali posto je async nece se odmah izvrsiti, ali kad se izvrsi bice sve kako treba

  const getBalance = async () => {
    if(!window.ethereum) {
      // proverava se da li ima instaliran metamask osoba koja je otvorila ovo u browseru (ne znam da li proverava samo za metamask ili i za druge ekstenzije za wallet-ove)
      setBalance('No wallet extension installed');
      return;
    }
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' }); // account ce postati adresa koja je povezana sa metamaskom (stavljeno je u niz jer funkcija vraca niz svih adresa, sto je uglavnom samo jedna ili ni jedna adresa ako nije povezano)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account); // funkcija koja vraca balance povezane adrese
    setBalance(ethers.utils.formatEther(balance)); // react funkcija koja updateuje vrednost
  };

  const mintFunction = async () => {
    if(!window.ethereum) {
      return;
    }
    // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    let maticPrice = 5; // ovde treba da se izracuna koliko treba da kosta u maticu tako sto odes na neki 
    let epsilon = 0.1; // ovo je neka relativno mala vrednost da ne bude da je matic pao u odnosu na eth pa contract izracuna da treba vise matica da se plati pa tranzakcija failuje
    let tx = await cityContract.maticMint(1, { value: ethers.utils.parseEther(`${maticPrice + epsilon}`) }); // ovo tx ce biti transaction hash od ove tranzakcije kad se posalje na blockchain. Value je vrednost koja se salje zajedno sa tranzakcijom (to je sad potrebno da bi smart contarct primio matic tokene, onoliko koliko kosta NFT)
    let receipt = await tx.wait(); // receipt je kao 'racun' u kojem pise sta se desilo u tranzakciji i da li se uspesno izrvsilo
    console.log('Mint receipt:', receipt); // ispisuje se receipt, ali inace bi se gledalo da li je doslo do neke greske i prikazalo nesto na ekranu
  };

  const gameplayFunction = async () => {
    if(!window.ethereum) {
      return;
    }

    let args = {}
    let tx = await gameplayContract.upgrade(args); // tu ce se pozivati jedna od funkcija iz ovog smart contracta, ovo ovako ne bi radilo i izbacilo bi gresku, ali ima skoro svaka funkcija kako se koristi u '/server/blockchain_api/api.js' programu
    let receipt = await tx.wait();
    console.log(receipt);
  };

  const flipSaleState = async () => {
    let tx = await cityContract.flipSaleState(); // poziva se funkcija sa smart contracta koja flipuje sale state
    let receipt = await tx.wait(); // ceka se da se dobije odgovor
    console.log('Flip sale state receipt:', receipt);

    let s = await cityContract.getSaleState(); // dobija se state iz smart contracta
    setSaleState(s); // setuje se sale state
  }

  return (
    <div>
        <h5>Your Balance: {balance}</h5>
        <button onClick={async () => await getBalance()}>Show My Balance</button>
        <h5>________________________________________________________________________</h5>
        <h5>This function is called from the City contract</h5>
        <button onClick={async () => await mintFunction()}>Mint function</button>
        <h5>________________________________________________________________________</h5>
        <h5>This is a function that is called from the Gameplay contract</h5>
        <button onClick={async () => await gameplayFunction()}>Gameplay function</button>
        <h5>________________________________________________________________________</h5>
        <h5>Sale state: {(saleState) ? 'Active' : 'Not active'}</h5>
        <button onClick={async () => await flipSaleState()}>Flip sale state</button>
    </div>
  );
}
