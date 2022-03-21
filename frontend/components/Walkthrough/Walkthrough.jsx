import ViewGL from "./viewgl.js";
import React from 'react';

import styles from '../styles/walkthrough.module.css';

export default class Scene extends React.Component {
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

  render() {
    return (
      <div className={styles.walkthrough}>
        <h1>Walkthrough</h1>
        <div className={styles.canv}>
          <div className={styles.btn}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="1em" 
              height="1em" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm2.207 7.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L10.914 12l3.293-3.293Z" clip-rule="evenodd"/>
            </svg>
          </div>
          <canvas ref={this.canvasRef} />
          <div className={styles.btn}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"  
              width="1em" 
              height="1em" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1ZM9.793 8.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L13.086 12L9.793 8.707Z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}