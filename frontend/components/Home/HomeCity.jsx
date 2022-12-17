import ViewGL from "../../three/viewgl.js";
import React from "react";

import styles from "../styles/homeCity.module.css";

import City from '../universal/city/City';

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
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    // Pass updated props to
    const newValue = this.props.whateverProperty;
    this.viewGL.updateValue(newValue);
  }

  componentWillUnmount() {
    // Remove any event listeners
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("resize", this.handleResize);
  }

  // ******************* EVENT LISTENERS ******************* //
  mouseMove = (event) => {
    this.viewGL.onMouseMove();
  };

  handleResize = () => {
    this.viewGL.onWindowResize(window.innerWidth, window.innerHeight);
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

export default function HomeCity({}) {

  const cityData = JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":120000,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"skyCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false}],"income":358216,"score":2627512}');

  return (
    <div className={styles.wrapper}>
      <City dataArg={cityData} rotation={3} showDelay={300} />
    </div>
  );
}