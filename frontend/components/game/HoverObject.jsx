import React, { useEffect, useRef, useState } from "react";
import { useBuildingStore } from "./BuildingStore.js";
import { buildingTypes } from "./BuildingTypes.js";
import { useGLTF } from "@react-three/drei";
import { gridDimensions, gridSize, plotSize, Scale } from "./GridData";
import House from "./modelComponents/House";
import Factory from "./modelComponents/Factory";
import Building from "./modelComponents/Building";
import LongBuilding from "./modelComponents/Building3x1";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import Store from "./modelComponents/Store.js";
import Office from "./modelComponents/Office.js";
import { Vector3 } from "three";

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
}

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export default function HoverObject() {
  const selectedBuilding = useBuildingStore((state) => state.selectedBuilding);
  let selectedBuildingType = selectedBuilding ? buildingTypes[selectedBuilding][0] : null; //checks if selectedBuilding is null - no building selected
  const hoveredXYCurrent = useBuildingStore((state) => state.hoveredXYCurrent); ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
  const hoveredXYPrevious = useBuildingStore((state) => state.hoveredXYPrevious); ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
  const buildMode = useBuildingStore((state) => state.buildMode);
  const hoverObjectMove = useBuildingStore((state) => state.hoverObjectMove);
  const buildRotation = useBuildingStore((state) => state.buildRotation);
  const setRotation = useBuildingStore((state) => state.setRotation);
  const hoverObjectRef = useRef(); ///REF KOJI SE VEZE ZA HOVEROBJECT

  const rotatingRef = useRef(false);

  const handler = ({ key }) => {
    if (String(key).toLowerCase() == "r" && !rotatingRef.current) {
      setRotation(buildRotation === 4 ? 1 : buildRotation + 1);
      if (hoverObjectRef.current.goalRotation) hoverObjectRef.current.goalRotation = hoverObjectRef.current.goalRotation + Math.PI / 2;
      else hoverObjectRef.current.goalRotation = Math.PI / 2;
      rotatingRef.current = true;
    }
  };
  const handlerUp = ({ key }) => {
    if (String(key).toLowerCase() == "r") {
      rotatingRef.current = false;
    }
  };

  useEventListener("keydown", handler);
  useEventListener("keyup", handlerUp);

  useFrame(() => {
    if (hoverObjectMove && selectedBuildingType && hoverObjectRef.current) {
      let epsilon = 0.1; //epsilon to optimize movement, so it doesn't move infinitely (allowed mistake)
      let epsilonrot = MathUtils.degToRad(1); //epsilon to optimize rotation, so it doesn't rotate infinitely (allowed mistake)
      let moving = false;
      let rotating = false;

      const posXCurrent = (hoveredXYCurrent.x + hoveredXYCurrent.x) / 2; ///RACUNA POZICIJU NA GRIDU (ovo je float zbog gradjevina siroke 3 square itd)
      const posYCurrent = (hoveredXYCurrent.y + hoveredXYCurrent.y) / 2;
      const positionCurrent = [
        plotSize * posXCurrent - (gridSize * plotSize) / 2 + plotSize / 2,
        0,
        plotSize * posYCurrent - (gridSize * plotSize) / 2 + plotSize / 2,
      ]; ///RACUNA 3D poziciju na mapi

      const axis = new Vector3(positionCurrent[0], 0, positionCurrent[2]);

      if (
        Math.abs(hoverObjectRef.current.position.x - positionCurrent[0]) > epsilon ||
        Math.abs(hoverObjectRef.current.position.z - positionCurrent[2]) > epsilon
      )
        moving = true;

      if (hoverObjectRef.current.goalRotation - hoverObjectRef.current.rotation.y > epsilonrot) {
        rotating = true;
      }
      //PROVERAVA DA LI JE U DOZOVLJENOJ GRESCI, AKO NIJE ONDA POMERAJ/ROTIRAJ

      if (moving) {
        ///POMERANJE HOVEROBJECTA
        let deltax = positionCurrent[0] - hoverObjectRef.current.position.x;
        hoverObjectRef.current.position.x = hoverObjectRef.current.position.x + deltax * 0.2;
        let deltaz = positionCurrent[2] - hoverObjectRef.current.position.z;
        hoverObjectRef.current.position.z = hoverObjectRef.current.position.z + deltaz * 0.2;
      }
      if (rotating) {
        //rotacija
        let deltarot = hoverObjectRef.current.goalRotation - hoverObjectRef.current.rotation.y;
        hoverObjectRef.current.rotation.y = hoverObjectRef.current.rotation.y + deltarot * 0.2;
      }
    }
  });

  if (selectedBuildingType && buildMode) {
    const position = [
      (selectedBuildingType.width * plotSize) / 2 - plotSize / 2,
      0,
      (selectedBuildingType.height * plotSize) / 2 - plotSize / 2,
    ];
    if (selectedBuildingType.type == "house") {
      return <House ref={hoverObjectRef} scale={Scale} key={"hoverObject"} />;
    } else if (selectedBuildingType.type == "factory") {
      return (
        <group ref={hoverObjectRef}>
          <Factory position={position} scale={Scale} key={"hoverObject"} />
        </group>
      );
    } else if (selectedBuildingType.type == "building") {
      return (
        <group ref={hoverObjectRef}>
          <Building position={position} scale={Scale} key={"hoverObject"} />
        </group>
      );
    } else if (selectedBuildingType.type == "store") {
      return (
        <group ref={hoverObjectRef}>
          <Store position={position} scale={Scale} key={"hoverObject"} />
        </group>
      );
    } else if (selectedBuildingType.type == "office") {
      return (
        <group ref={hoverObjectRef}>
          <Office position={position} scale={Scale} key={"hoverObject"} />
        </group>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}

// MOZDA SCALE DA SE RACUNA NA OSNOVU PLOTSIZE, OVAKO JE MALO GLUPO...
