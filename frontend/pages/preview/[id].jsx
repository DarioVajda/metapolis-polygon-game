import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import Preview from '../../components/preview/Preview';

const preview = () => {

  const router = useRouter();
  const route = router.query;
  let id;

  const [idValidity, setIdValidity] = useState(0); // 0 - loading, 1 - valid, 2 - not valid

  const isValidID = async () => {
    if(route.id % 1 !== 0) {
      console.log('setIdValidity(2);');
      setIdValidity(2);
      return;
    }

    let id = parseInt(route.id);
    
    if(typeof id !== 'number') {
      setIdValidity(2);
      return;
    }

    let num = await (await fetch('http://localhost:8000/count')).json();
    num = num.count;
    // setNumOfNfts(num);

    if( 
      Object.values(route).length === 1 && 
      route.id != undefined && 
      id >= 0 && 
      id < num
    ) {
      console.log('setIdValidity(1);');
      setIdValidity(1);
    }
    else {
      console.log('setIdValidity(2);');
      setIdValidity(2);
    }
  }

  useEffect(() => {
    if(Object.values(route).length === 0) return;

    console.log(route);
    isValidID();

  }, [route]);

  if(idValidity === 0) return (
    <div>Loading...</div>
  )
  else if(idValidity === 1) return (
    <Preview id={route.id} />
  )
  else return (
    <div>Error</div>
  )
}

export default preview