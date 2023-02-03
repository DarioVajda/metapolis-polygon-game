import React from 'react'

import styles from '../styles/aboutUs.module.css';

import AboutUsPerson from './AboutUsPerson';

const AboutUs = () => {

  const person1 = {
    nickname: "VD_dada"
  }
  const person2 = {
    nickname: "Marennn"
  }
  const person3 = {
    nickname: "Zdenja"
  }

  return (
    <div className={styles.wrapper}>
      <h1>
        About Us
      </h1>
      <p>
        Our goal with this project is to... It is on the polygon network, the reasons,... <br />
        Eu fugiat ad amet veniam. Ipsum aliquip adipisicing consequat do ex adipisicing minim mollit sint. Esse ut ipsum elit proident velit laborum occaecat duis qui nostrud dolore ipsum nostrud veniam. Est adipisicing proident aliquip excepteur velit occaecat elit eiusmod consequat tempor est exercitation. Qui duis ex aliquip Lorem aute qui. Pariatur Lorem voluptate nisi laborum culpa duis. Cillum irure culpa veniam ullamco reprehenderit pariatur sit in proident elit culpa anim exercitation.
      </p>
      <div className={styles.people}>
        <AboutUsPerson data={person1} />
        {/* <AboutUsPerson data={person2} /> */}
        {/* <AboutUsPerson data={person3} /> */}
        {/* Ostao sam jedini u ovome 😭 */}
      </div>
      <div>
        {/* Jos neki random tekst u sklopu “About us”. Treba da se sredi izgled ovoga i da se smisli sta ce pisati. Na primer nas cilj sa ovim projektom (osim da se iskesiramo, treba nesto sto dobro zvuci) i slicne stvari */}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem dolores dolor, accusantium, tempora, assumenda omnis suscipit voluptatibus sint nobis perspiciatis iusto a quae repellat tempore aliquam laudantium cum quisquam recusandae?
      </div>
    </div>
  )
}

export default AboutUs