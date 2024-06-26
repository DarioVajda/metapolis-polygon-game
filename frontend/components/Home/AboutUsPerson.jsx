import React from 'react'

import styles from '../styles/aboutUs.module.css';

const AboutUsPerson = ({ data }) => {
  return (
    <div className={styles.person}>
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="15em" 
        height="15em" 
        viewBox="0 0 16 16"
      >
        <g fill="currentColor"><path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></g>
      </svg>
      <h1>{data.nickname}</h1>
      <h4>other info, links, etc. Ostao sam jedini u ovome 😭</h4>
    </div>
  )
}

export default AboutUsPerson