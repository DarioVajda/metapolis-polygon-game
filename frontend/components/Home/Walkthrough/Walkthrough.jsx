import ViewGL from "./viewgl.js";
import React, { Suspense } from 'react';
import { useState } from 'react';
import { useRef } from "react";

import { useFrame, useThree } from '@react-three/fiber';

import { useSpring } from "@react-spring/three";
import { a } from "@react-spring/three";

import { MapControls } from "@react-three/drei";

import styles from '../../styles/walkthrough.module.css';

import WorldCanvas from '../../game/WorldCanvas';
import Lights from '../../game/Lights';

// import BuildingList from '../../universal/city/BuildingList';
import Buildings from '../../game/Buildings/Buildings'
import Landscape from '../../universal/city/Landscape';
import Render from '../../universal/city/Render';

class Scene extends React.Component {
  constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
  }

  // ******************* COMPONENT LIFECYCLE ******************* //
  componentDidMount() {
    // Get canvas, pass to custom class
    const canvas = this.canvasRef.current;
    this.viewGL = new ViewGL(canvas);

    // Init any event listeners
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    // Pass updated props to 
    const newValue = this.props.whateverProperty;
    this.viewGL.updateValue(newValue);
  }

  componentWillUnmount() {
    // Remove any event listeners
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('resize', this.handleResize);
  }

  // ******************* EVENT LISTENERS ******************* //
  mouseMove = (event) => {
    this.viewGL.onMouseMove();
  }

  handleResize = () => {
    this.viewGL.onWindowResize(window.innerWidth, window.innerHeight);
  };

  leftBtn = () => {
    console.log("ovde ce biti funkcija kojom se vrati jedan korak unazad");
  }

  rightBtn = () => {
    console.log("ovde ce biti funkcija kojom se ode jedan korak unapred");
  }

  // Ideja kako da se resi problem sa pojavljivanjem dodatnog objasnjenja kad se klikne na upitnik:
  //   - treba da se pojavi taj mali prozor sa relative pozicijom
  //   - osim tog prozora ce se pojaviti jedan providan div preko celog ekrana koji kad se klikne, zatvara taj prozorcic
  //   - i treba da se doda scroll listener ili tako nesto da nestane prozorcic i kad se skroluje

  render() {
    return (
      <div className={styles.walkthrough}>
        <h1>
          Walkthrough
        </h1>
        <div className={styles.canv}>
          <div className={styles.btn}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="1em" 
              height="1em" 
              viewBox="0 0 24 24"
              onClick={this.leftBtn}
            >
              <path fill="currentColor" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm2.207 7.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L10.914 12l3.293-3.293Z" clipRule="evenodd"/>
            </svg>
          </div>
          <canvas groupRef={this.canvasRef} />
          <div className={styles.btn}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"  
              width="1em" 
              height="1em" 
              viewBox="0 0 24 24"
              onClick={this.rightBtn}
              >
              <path fill="currentColor" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1ZM9.793 8.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L13.086 12L9.793 8.707Z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>
        <p>See how every building affects your city to help you develop the winning strategy!</p>
      </div>
    );
  }
}

const Group = ({ rotation, position, groupRef, city }) => {

  const { gl, invalidate, camera } = useThree()

  const { pos, rot } = useSpring({
    pos: `[${position[0]}, ${position[1]}, ${position[2]}]`,
    rot: `[${rotation[0]}, ${rotation[1]}, ${rotation[2]}]`,
  })

  const convertPosition = (p) => {
    let r = JSON.parse(p).map(e => -e);
    invalidate();
    // console.log(r);
    return r;
  }

  const convertRotation = (p) => {
    let r = JSON.parse(p);
    return r;
  }

  return (
    // <a.group ref={groupRef} position={pos.to(pos => convertPosition(pos))} rotation={[-Math.PI/2.8, Math.PI/6, 0]} >
    <a.group ref={groupRef} position={pos.to(pos => convertPosition(pos))} rotation={rot.to(rot => convertRotation(rot))} >
      <Lights />
      <Landscape />
      {/* <BuildingList data={city} /> */}
      {/* <BuildingList data={{buildings: []}} /> */}
      <Buildings id={3} data={city} />
    </a.group>
  )
}

export default function Walkthrough() {

  const groupRef = useRef();

  const [ counter, setCounter ] = useState(0);

  const positions = [
    [ 0, 200, 20 ],
    [ 0, 200, 0 ],
    [ 30, 60, 10 ],
  ]

  const rotations = [
    [ -Math.PI/3.2, Math.PI/6, 0 ],
    [ 0, 0, 0 ],
    [ -Math.PI/3, Math.PI/4, 0 ],
  ]

  const city = [
    JSON.parse('{"buildings":[{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":120000,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"skyCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false}],"income":358216,"score":2627512}'),
    JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":120000,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"skyCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false}],"income":358216,"score":2627512}'),
    JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":120000,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"skyCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false}],"income":358216,"score":2627512}'),
  ]

  const messages = [
    'This is a message explaining something about the game. This is a message explaining something about the game. This is a message explaining something about the game. This is a message explaining something about the game.',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquid animi eaque iusto voluptatibus? Sed officia quo totam culpa, explicabo doloremque, facilis fugit cupiditate repellat vero itaque natus quae velit.'
  ]

  const rightBtn = () => {
    console.log("Right button");
  }
  
  const leftBtn = () => {
    console.log("Left button");
  }

  return (
    <div className={styles.walkthrough}>
      <h1>
        Walkthrough
      </h1>
      <div className={styles.canv}>
        <div className={styles.btn} onClick={() => setCounter(counter - 1)}>
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24"
            onClick={leftBtn}
          >
            <path fill="currentColor" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm2.207 7.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L10.914 12l3.293-3.293Z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className={styles.canvas}>
          <div>
            <WorldCanvas pixelRatio={[1, 1]} position={[0, 0, 0]}>
              <Render fpsMax={1e-5} />
              <Group 
                position={positions[counter%positions.length]} 
                rotation={rotations[counter%rotations.length]} 
                city={city[counter%city.length]}
                groupRef={groupRef} 
              />
            </WorldCanvas>
          </div>
          <div>
            <div>
              {messages[counter%messages.length]}
            </div>
          </div>
        </div>
        <div className={styles.btn}  onClick={() => setCounter(counter + 1)}>
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24"
            onClick={rightBtn}
            >
            <path fill="currentColor" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1ZM9.793 8.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L13.086 12L9.793 8.707Z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
      {/* <p>See how every building affects your city to help you develop the winning strategy!</p> */}
    </div>
  );
} 