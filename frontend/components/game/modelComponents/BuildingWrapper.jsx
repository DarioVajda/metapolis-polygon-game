import React, { useRef } from 'react'

const BuildingWrapper = ({ children, onClick }) => {
  const ref = useRef();

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

    // console.log('suiii', ref.current.position);
    if(onClick) {
      onClick(ref);
    }

    resetOnClick();
  }

  return (
    <group onClick={onClick?onClickHandler:null}>
      { React.cloneElement(children, { ref: ref }) }
    </group>
  )
}

export default BuildingWrapper