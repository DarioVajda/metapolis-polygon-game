import { useState, useRef } from 'react'

import ArrowIcon from '../universal/icons/ArrowIcon';

import styles from '../styles/faqs.module.css';

const FAQuestion = ({q, a, i}) => {

  const [show, setShow ] = useState(false);
  
  const answerRef = useRef();

  // console.log(answerRef.current.clientHeight);

  return (
    <div className={styles.item}>
      <div className={styles.question} onClick={() => setShow(!show)}>
        {i+1}. {q}
        <span><ArrowIcon verticalFlip direction={show?0:2} /></span>
      </div>
      {/* <div className={`${styles.answer} ${show?styles.showAnswer:''}`}> */}
      <div className={`${styles.answer} ${show?'':''}`} style={show ? { maxHeight: `${answerRef.current.clientHeight}px`} : {}}>
        <div ref={answerRef}>
          {a.repeat(i+1)}
        </div>
      </div>
    </div>
  )
}

export default FAQuestion