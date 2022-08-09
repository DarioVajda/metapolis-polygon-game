import { Html } from "@react-three/drei";
import { React, useState, useRef, useEffect } from "react";
import styles from "../styles/FloatingMenu.module.css";

export default function FloatingMenu() {
  let FloatingMenuRef = useRef();

  return (
    <group ref={FloatingMenuRef}>
      <Html
        sprite
        occlude
        transform
        wrapperClass={styles.FloatingMenuContainer}
      >
        <p>HelloWorld</p>
      </Html>
    </group>
  );
}
