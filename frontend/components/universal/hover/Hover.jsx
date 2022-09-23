import React from 'react'
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import styles from './hover.module.css';

const Hover = ({ children, info, childWidth, specialId, sidePadding }) => {

  const ref = useRef(null);
  const dimensionsDivRef = useRef(null);
  const [size, setSize] = useState();
  const [edgeOffset, setEdgeOffset] = useState(0);

  useEffect(() => {
    let reloading = false;
    setSize({ height: ref.current.clientHeight, width: ref.current.clientWidth });

    const delay = async (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    const wait = async () => {
      reloading = true;
      await delay(100);
      reloading = false;
    }

    let cb = function () {
      if(reloading === false) {
        // console.log('reload');
        setSize({ height: ref.current.clientHeight, width: ref.current.clientWidth });
        wait();
      }
    };
    window.addEventListener("resize", cb);

    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);

  // console.log({size})

  const offset = (el) => {
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // console.log({ top: rect.top + scrollTop, left: rect.left + scrollLeft })
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  const onHover = () => {
    let position = offset(document.querySelector(`#${specialId}`));
    let popupWidth = window.innerWidth - dimensionsDivRef.current.clientWidth;
    
    let left = position.left;
    let right = window.innerWidth - position.left;

    console.log({ left, right, popupWidth });
    if(left < popupWidth / 2) {
      // console.log('left', left, popupWidth/2);
      setEdgeOffset(popupWidth / 2 - left - ref.current.clientWidth / 2);
    }
    if(right < popupWidth / 2) {
      console.log('right', right, popupWidth/2);
      setEdgeOffset(right - popupWidth / 2 - ref.current.clientWidth / 2);
    }
    console.log(edgeOffset);
  }

  let _sidePadding = sidePadding ? sidePadding : '0px';

  // JOS TREBA UZETI U OBZIR SIRINU SCROLL BARA I SKONTATI ZASTO SE NE PROMENE VREDNOSTI ZA OFFSET NAKON PROMENE SIRINE EKRANA

  return (
    <div className={styles.hoverWrapper} id={specialId}>
      <div ref={dimensionsDivRef} style={ childWidth ? { position: 'fixed', width: `calc(${window.innerWidth}px - ${childWidth} - ${_sidePadding} - ${_sidePadding})` }:{} } />
      <div style={{width: '100%', backgroundColor: 'transparent', cursor: 'pointer' }} ref={ref}  onMouseEnter={onHover} onClick={() => offset(document.querySelector(`#${specialId}`))}>
        {children}
      </div>
      {
        info !== '' &&
        <div style={{ position: 'relative', height: 0, width: 0, backgroundColor: 'transparent', transform: 'translateY(5px)' }} >
          <div style={{ minWidth: childWidth?childWidth:size?size.width:0, visibility: size?'visible':'hidden', backgroundColor: 'transparent', transform: `translateX(${edgeOffset}px)` }} >
            <div className={styles.hoverItem} style={{ bottom: `${size?size.height+10:0}px`, transform: `translateY(-100%) translateX(${size?size.width/2:0}px)` }} >
              {info}
              <div style={{ transform: `translateX(${-edgeOffset}px)` }}></div>
            </div>
          </div>  
        </div>
      }
    </div>
  )
}

export default Hover