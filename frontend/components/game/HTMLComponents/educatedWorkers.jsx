import React from "react";
import styles from "../../styles/Game.module.css";
import Image from "next/image";
import educatedPerson from "./educated-person-128.png";

const EducatedWorkers = (props) => {
  return (
    <div
      id="educatedWorkersContainer"
      className={styles.dataContainer}
      style={{ top: "2%", left: "12%", pointerEvents: "none" }}
    >
      <div id="educatedWorkerstextDiv" className={styles.dataTextDiv}>
        Educated:
      </div>
      <div id="educatedWorkersDataDiv" className={styles.dataDiv} style={{ pointerEvents: "none" }}>
        <div id="educatedWorkersImgDiv" className={styles.imgDiv}>
          <Image src={educatedPerson} layout="fill" alt="EducatedWorkers" />
        </div>
        <div id="educatedAmmountDiv" className={styles.ammountDiv}>
          {props.value}
        </div>
      </div>
    </div>
  );
};

export default EducatedWorkers;
