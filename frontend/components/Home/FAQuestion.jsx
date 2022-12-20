import { useState } from 'react'

import styles from '../styles/faqs.module.css';

import ArrowIcon from '../universal/icons/ArrowIcon';

const FAQuestion = ({q, a, i}) => {

  const [show, setShow ] = useState(false);

  return (
    <div className={styles.item}>
      <div className={styles.question} onClick={() => setShow(!show)}>
        {i+1}. {q}
        <span><ArrowIcon direction={show?0:2} verticalFlip /></span>
        {/* <span>{show?'-':'+'}</span> */}
      </div>
      <div className={`${styles.answer} ${show?styles.showAnswer:''}`}>
        {a.repeat(i+1)}
      </div>
    </div>
  )
}

export default FAQuestion