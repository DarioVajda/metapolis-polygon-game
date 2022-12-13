import React, { useRef } from 'react'

import { useBuildingStore } from '../BuildingStore';

const BuildingWrapper = ({ children, onClick }) => {
  const ref = useRef();

  const { theme } = useBuildingStore(state => state.staticData);

  const clicked = useRef(false);

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const resetOnClick = async () => {
    await delay(50);
    clicked.current = false;
  }

  const onClickHandler = () => {
    if(clicked.current === true) return;
    
    clicked.current = true;

    if(onClick) {
      onClick(ref);
    }

    resetOnClick();
  }

  // console.log(theme);
  return (
    <group onClick={onClick?onClickHandler:null}>
      { React.cloneElement(children, { ref: ref, theme: theme }) }
    </group>
  )
}

export default BuildingWrapper