import React from 'react'

import styles from '../styles/faqs.module.css';

import FAQuestion from './FAQuestion';

const FAQs = () => {
  let faqs = [
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    },
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    },
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    },
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    },
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    },
    {
      q: 'This is a frequently asked question that needs to be answered?',
      a: 'This is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question this is the answer to the question.'
    }
  ]
  
  return (
    <div className={styles.faqs}>
      <h1>FAQs</h1>
      <div>
        {
          faqs.map((item, index) => (
            <div key={index}>
             <FAQuestion q={item.q} a={item.a} i={index}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FAQs