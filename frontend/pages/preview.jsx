import { useRouter } from 'next/router'
import React from 'react'

import City from '../components/universal/city/City';

const CityPreview = () => {
  const router = useRouter();
  const route = router.query;

  const data = route.data ? JSON.parse(route.data) : undefined;
  console.log(data);

  if(data) return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
      <div style={{ height: 'min(100vh, 100vw)', width: 'min(100vh, 100vw)' }}>
        <City id={6} dataArg={data} rotation={0} />
      </div>
    </div>
  )
  else return <></>
}

export default CityPreview