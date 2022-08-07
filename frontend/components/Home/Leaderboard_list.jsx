import Leaderboard_item from "../components/Leaderboard_item"
import React, { useEffect, useRef, useState } from "react"

export const ExpandedContext = React.createContext();

const Leaderboard_list = () => {

  // trebam da promenim nacin ucitavanja gradova, to ne treba da se radi sve odjednom i onda tek da se sortira, mozda cak treba u smart contract-u da budu nekako sortirani, ne znam jos kako bih to uradio, ali treba nesto da se promeni jer bi ovako predugo trajalo da se ucita prvih 100 osoba jer ne znam ko je koji unapred...

  const [ cities, setCities ] = useState([]);
  const expanded = useRef(-1);

  const getCityList = async () => {
    let list = await (await fetch('http://localhost:8000/leaderboard')).json();
    console.log('SORTED LIST:', list);
    setCities(list); // sets the city list to an array with IDs sorted by their score
  }
  
  useEffect(() => {
    getCityList();
  }, []);

  useEffect(() => {
    console.log('useEffect:', expanded.current);
  }, [expanded.current]);

  const setExpandedFunction = (newIndex) =>{
    console.log('newIndex', newIndex);
    expanded.current = newIndex;
  }

  return (
    <ExpandedContext.Provider value={expanded.current}>
      <div>
        {
          cities.length === 0 ?
          <>No Cities</> :
          <div>
            {
              cities.map((element, index) => (
                <div key={index}>
                  <Leaderboard_item 
                    id={element}
                    rank={index+1}
                    expanded={expanded.current===index}
                    setExpanded={() => setExpandedFunction(expanded.current===index?-1:index)}
                  />
                </div>
              ))
            }
          </div>
        }
      </div>
    </ExpandedContext.Provider>
  )
}

export default Leaderboard_list