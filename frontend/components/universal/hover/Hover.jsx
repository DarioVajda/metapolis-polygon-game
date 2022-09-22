import React from 'react'
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import styles from './hover.module.css';

const Hover = ({ children, info, childWidth }) => {

  const ref = useRef(null);
  const [size, setSize] = useState();

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

  return (
    <div className={styles.hoverWrapper} >
      <div style={{width: '100%', backgroundColor: 'transparent', cursor: 'pointer' }} ref={ref}>
        {children}
      </div>
      {
        info !== '' &&
        <div style={{ position: 'relative', height: 0, width: 0, backgroundColor: 'transparent', transform: 'translateY(5px)' }} >
          <div style={{ minWidth: childWidth?childWidth:size?size.width:0, visibility: size?'visible':'hidden', backgroundColor: 'transparent', transform: 'translateX(50px)' }} >
            <div className={styles.hoverItem} style={{ bottom: `${size?size.height+10:0}px`, transform: `translateY(-100%) translateX(${size?size.width/2:0}px)` }} >
              {info}
              <div style={{ transform: 'translateX(-50px)' }}></div>
            </div>
          </div>  
        </div>
      }
    </div>
  )
}

export default Hover