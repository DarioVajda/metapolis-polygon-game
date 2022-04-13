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
          <canvas ref={this.canvasRef} />
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