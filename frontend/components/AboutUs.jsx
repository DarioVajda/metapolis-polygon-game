import React from 'react'

import styles from './styles/aboutUs.module.css';

import AboutUsPerson from './AboutUsPerson';

const AboutUs = () => {

  const person1 = {
    nickname: "VD_dada"
  }
  const person2 = {
    nickname: "Marennn"
  }

  return (
    <div className={styles.wrapper}>
      <h1>
        About Us
      </h1>
      <div className={styles.people}>
        <AboutUsPerson data={person1} />
        <AboutUsPerson data={person2} />
      </div>
      <div>
        Jos neki random tekst u sklopu “About us”. Treba da se sredi izgled ovoga i da se smisli sta ce pisati. Na primer nas cilj sa ovim projektom (osim da se iskesiramo, treba nesto sto dobro zvuci) i slicne stvari
      </div>
    </div>
  )
}

export default AboutUs