import React, { useState, useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import styles from "../styles/GameUI.module.css";
import { Group } from "three";
import { useBuildingStore } from "./BuildingStore";
import GoldDiv from "./HTMLComponents/goldIcon.jsx";
import EducatedWorkers from "./HTMLComponents/educatedWorkers";
import UnEducatedWorkers from "./HTMLComponents/unEducatedWorkers";
import { generateUUID } from "three/src/math/MathUtils";
import { ethers } from "ethers";
import { ID } from "./GridData";
import { buildingTypes } from "./BuildingTypes";

const getIncome = async (id) => {
  const message = `getting moola for #${id} City NFT, messageid: ` + generateUUID();

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let signature;
  try {
    signature = await signer.signMessage(message);
  } catch (error) {
    return { ok: false, status: error.message };
  }
  const address = await signer.getAddress();

  let body = JSON.stringify({ params: { id: id }, address: address, message: message, signature: signature });
  console.log(body);
  const response = await fetch(`http://localhost:8000/cities/${id}/getincome`);
  if (response.ok) dataLoaded.current = false; /// need to refresh data if everything went through
};

const apiSendInstructions = async (id, instructions) => {
  const message = `Saving changes in city ${id}, messageUUID:${generateUUID()}`;

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let signature;
  try {
    signature = await signer.signMessage(message);
  } catch (error) {
    return { ok: false, status: error.message };
  }
  const address = await signer.getAddress();

  instructions = instructions.map((element) => {
    element.body.signature = signature;
    element.body.message = message;
    return element;
  });
  console.log(instructions);
  let body = JSON.stringify({
    instructions,
    signature: signature,
    message: message,
  });
  const response = await fetch(`http://localhost:8000/cities/${id}/instructions`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
  return response;
};

function HTMLContent({ ID }) {
  const [data, setData] = useState(false);
  const dataLoaded = useRef(false);
  const buildings = useBuildingStore((state) => state.buildings); //added for refreshing on build
  const money = useBuildingStore((state) => state.money);
  const educatedWorkers = useBuildingStore((state) => state.educatedWorkers);
  const unEducatedWorkers = useBuildingStore((state) => state.unEducatedWorkers);
  const educatedWorkersNeeded = useBuildingStore((state) => state.educatedWorkersNeeded);
  const unEducatedWorkersNeeded = useBuildingStore((state) => state.unEducatedWorkersNeeded);

  const [showBuildingsList, setShowBuildingsList] = useState(false);
  const [selectedBuildingInList, setSelectedBuildingInList] = useState(0);
  const toggleBuildings = () => setShowBuildingsList(!showBuildingsList);
  const selectBuildingInGui = useBuildingStore((state) => state.selectBuildingInGui);
  const setBuildMode = useBuildingStore((state) => state.setBuildMode);
  const buildMode = useBuildingStore((state) => state.buildMode);
  const instructions = useBuildingStore((state) => state.instructions);

  // #region Getting the data
  async function getCityData(id) {
    let response = await fetch(`http://localhost:8000/cities/${id}/data`);
    if (response.ok) {
      let json = await response.json();
      dataLoaded.current = true;
      setData(json);
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }

  // Updating data in store, essentially updating state
  useEffect(() => {
    if (data) {
      useBuildingStore.setState({
        money: data.money,
        educatedWorkers: data.educated,
        unEducatedWorkers: data.normal,
        educatedWorkersNeeded: data.educatedWorkers,
        unEducatedWorkersNeeded: data.normalWorkers,
      });
    }
  }, [data]);

  // Get city data on first render
  useEffect(() => {
    getCityData(ID);
  }, []);

  return (
    <>
      <div id="data" style={{ pointerEvents: "none" }}>
        <GoldDiv value={data && dataLoaded.current ? money : "..."} />
        <EducatedWorkers value={data && dataLoaded.current ? educatedWorkers + " / " + educatedWorkersNeeded : "..."} />
        <UnEducatedWorkers
          value={data && dataLoaded.current ? unEducatedWorkers + " / " + unEducatedWorkersNeeded : "..."}
        />
      </div>
      <div id="menuButtons" style={{ pointerEvents: "none" }}>
        <button className={styles.roundedFixedBtn} style={{ bottom: "2%", left: "2%" }} onClick={toggleBuildings}>
          Buildings
        </button>
        <button
          className={buildMode === 0 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "2%", right: "22%" }}
          onClick={() => setBuildMode(0)}
        >
          Select
        </button>
        <button
          className={buildMode === 1 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "2%", right: "12%" }}
          onClick={() => setBuildMode(1)}
        >
          Build
        </button>
        <button
          className={buildMode === 2 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "2%", right: "2%" }}
          onClick={() => setBuildMode(2)}
        >
          Demolish
        </button>
        <button
          className={styles.roundedFixedBtn}
          style={{ bottom: "16%", right: "2%", width: "18%", backgroundColor: "#cdff8a9a" }}
          onClick={() => {
            let response = apiSendInstructions(ID, instructions);
            if (response.ok) getCityData(ID);
            // console.log(response);
          }}
        >
          Save changes
        </button>
      </div>
      <div id="buildingsList" hidden={!showBuildingsList} style={{ pointerEvents: "none" }}>
        <button
          className={selectedBuildingInList === 1 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "15%", left: "2%" }}
          onClick={() => {
            selectBuildingInGui("house"), setSelectedBuildingInList(1);
          }}
        >
          House
          <br />
          Cost:{buildingTypes.house[0].cost}
        </button>
        <button
          className={selectedBuildingInList === 2 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "15%", left: "12%" }}
          onClick={() => {
            selectBuildingInGui("factory"), setSelectedBuildingInList(2);
          }}
        >
          Factory
          <br />
          Cost:{buildingTypes.factory[0].cost}
        </button>
        <button
          className={selectedBuildingInList === 3 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "15%", left: "22%" }}
          onClick={() => {
            selectBuildingInGui("building"), setSelectedBuildingInList(3);
          }}
        >
          Building
          <br />
          Cost:{buildingTypes.building[0].cost}
        </button>
        <button
          className={selectedBuildingInList === 4 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "15%", left: "32%" }}
          onClick={() => {
            selectBuildingInGui("store"), setSelectedBuildingInList(4);
          }}
        >
          Store
          <br />
          Cost:{buildingTypes.store[0].cost}
        </button>
        <button
          className={selectedBuildingInList === 5 ? styles.roundedFixedBtnClicked : styles.roundedFixedBtn}
          style={{ bottom: "15%", left: "42%" }}
          onClick={() => {
            selectBuildingInGui("office"), setSelectedBuildingInList(5);
          }}
        >
          Office
          <br />
          Cost:{buildingTypes.office[0].cost}
        </button>
      </div>
      <div id="utils" style={{ pointerEvents: "none" }}>
        <button
          className={styles.roundedFixedBtn}
          style={{ top: "12%", left: "2%", height: "8%" }}
          onClick={() => {
            getIncome(ID);
          }}
        >
          Get income
        </button>
      </div>
    </>
  );
}

export default HTMLContent;
