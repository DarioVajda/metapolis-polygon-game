import { Html } from "@react-three/drei";
import { React, useState, useRef, useEffect } from "react";
import styles from "../styles/FloatingMenu.module.css";

export default function FloatingMenu() {
  let FloatingMenuRef = useRef();

  return (
    <group position={[0, 10, 0]} rotation={[0, 0, 0]} ref={FloatingMenuRef}>
      <Html
        sprite
        // occlude
        transform
        wrapperClass={styles.floatingMenuContainer}
        distanceFactor={10}
      >
        <div className={styles.floatingMenuContainer__window}>
          <div className={styles.floatingMenuContainer__titlebar}>
            <span className={styles.floatingMenuContainer__title}>New title</span>
            <button className={styles.floatingMenuContainer__close}>&times;</button>
          </div>
          <div className={styles.floatingMenuContainer__content}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque maiores porro ad recusandae reprehenderit
            placeat eius, non omnis alias? Omnis laborum incidunt nihil explicabo tempore beatae, perferendis modi minus
            possimus!
          </div>
          <div className={styles.floatingMenuContainer__buttons}>
            <button
              className={`${styles.floatingMenuContainer__button}
                ${styles.floatingMenuContainer__buttonOk}
                ${styles.floatingMenuContainer__buttonFill}`}
            >
              OK
            </button>
            <button className={`${styles.floatingMenuContainer__button} ${styles.floatingMenuContainer__buttonCancel}`}>
              CANCEL
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
