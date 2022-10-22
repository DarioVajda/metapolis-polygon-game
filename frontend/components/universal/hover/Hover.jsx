import React from 'react'
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import useScrollbarSize from 'react-scrollbar-size';

import styles from './hover.module.css';

const Hover = ({ children, info, childWidth, specialId, sidePadding, underneath }) => {

  const ref = useRef(null);
  const dimensionsDivRef = useRef(null);
  const scrollBar = useScrollbarSize();
  const [size, setSize] = useState({ height: 0, width: 0});
  const [edgeOffset, setEdgeOffset] = useState(0);
  const [hover, setHover] = useState(false);

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

  useEffect(() => {
    if(size.width === ref.current.clientWidth && size.height === ref.current.clientHeight) return;

    setSize({ height: ref.current.clientHeight, width: ref.current.clientWidth });
  })

  // console.log({size})

  const offset = (el) => {
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // console.log({ top: rect.top + scrollTop, left: rect.left + scrollLeft })
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  const onHover = () => {
    setEdgeOffset(0);
    setHover(true);
    if(childWidth === undefined) {
      return;
    }
    let position = offset(document.querySelector(`#${specialId}`));
    let popupWidth = window.innerWidth - dimensionsDivRef.current.clientWidth;
    
    let left = position.left;
    let right = window.innerWidth - position.left;

    // console.log({ left, right, popupWidth });
    if(left + ref.current.clientWidth / 2 < popupWidth / 2) {
      // console.log('left', left, popupWidth/2);
      setEdgeOffset(popupWidth / 2 - left - ref.current.clientWidth / 2);
    }
    if(right - ref.current.clientWidth / 2 < popupWidth / 2) {
      // console.log('right', right, popupWidth/2, scrollBar.width);
      setEdgeOffset(right - popupWidth / 2 - ref.current.clientWidth / 2 - scrollBar.width);
    }
    // console.log(edgeOffset);
  }

  const notHover = () => {
    setHover(false);
  }

  let _sidePadding = sidePadding ? sidePadding : '0px';

  // console.log(size);

  return (
    <div className={styles.hoverWrapper} id={specialId}>
      <div ref={dimensionsDivRef} style={ childWidth ? { position: 'fixed', width: `calc(${window.innerWidth}px - ${childWidth} - ${_sidePadding} - ${_sidePadding})` }:{} } />
      <div style={{width: '100%', backgroundColor: 'transparent' }} ref={ref} onMouseEnter={undefined} onMouseLeave={undefined}>
        { React.cloneElement(children, { onMouseEnter: onHover, onMouseLeave: notHover }) }
      </div>
      {
        info !== '' &&
        <div style={{ pointerEvents: 'none', position: 'relative', height: 0, width: 0, backgroundColor: 'transparent', transform: 'translateY(5px)' }} >
          <div className={hover?styles.hovered:''} style={{ bottom: `${size?size.height+(underneath?-6:10):0}px`, position: 'relative', minWidth: childWidth?childWidth:size?size.width:0, visibility: size?'visible':'hidden', backgroundColor: 'transparent', transform: `translateX(${edgeOffset}px)` }} >
            <div className={styles.hoverItem} style={{ transform: `translateY(${underneath?'':'-'}100%) translateX(${size?size.width/2:0}px)` }} >
              {info}
              <div className={underneath?styles.triangleUnderneath:styles.triangleAbove} style={{ transform: `translateX(${-edgeOffset}px)${underneath?` translateY(-${size.height}px`:''}` }} />
            </div>
          </div>  
        </div>
      }
    </div>
  )
}

export default Hover