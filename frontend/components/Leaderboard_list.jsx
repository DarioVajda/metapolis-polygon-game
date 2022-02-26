import Leaderboard_item from "../components/Leaderboard_item"
import { useEffect, useState } from "react"

const Leaderboard_list = () => {

  const [ cities, setCities ] = useState([]);
  const [ expanded, setExpanded ] = useState(-1);
  var list = [];
  var element;

  const getCities = async () => {
    let i = 0;
    do {
      element = await (await fetch(`http://localhost:8000/cities/${i}/data`)).json();
      if(element.owner !== '0x0000000000000000000000000000000000000000') {
        let price = 0.35;
        element.price = price;
        element.index = i;
        list.push(element);
      }
      i++;
    } while(element.owner !== '0x0000000000000000000000000000000000000000');
    setCities(list);
  }
  
  useEffect(() => {
    getCities();
  }, []);


  return (
    <div>
      {
        cities.length === 0 ?
        <>No Cities</> :
        <div>
          {
            cities.map((element, index) => (
              <div key={index}>
                <Leaderboard_item id={element.index} city={element} rank={index+1} expanded={expanded===index} setExpanded={() => setExpanded(expanded===index?-1:index)}/>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Leaderboard_list