import ViewGL from "../gameplay/viewgl.js";
import React from 'react';

// OBJASNJENJE ZA TO KAKO RADI THREE SA REACTOM:
// - ovde je React komponenta napravljena kao klasa, a ne kao funkcija (inace je funkcija, ali moze oba)
// - kad je komponenta klasa onda postoji funkcija render koja mora da postoji i ona se poziva kad treba da se prikaze nesto na ekranu (ovo je praktirno ono sto inace bude u komponenti koja je funkcija)
// - osim toga ima 'ugradjeno' funkcije componentDidMount (poziva se kad se napravi komponenta prvi put), componentDidUpdate (poziva se kad se promene neki state-ovi u komponenti) i componentWillUnmount (poziva se kad se unisti komponenta). Mozda postoji jos nesto i mozda sa ih lose objasnio (nisam 100% siguran jer nisam gledao nikakvu konkretnu dokumentaciju za ovo). Ps ovo su nasledjene funkcije od React.Component klase, a ovako im damo neku funkcionalnost (ovde spada i render funkcija)
// - treba ti referenca od ove komponente da bi mogao u njoj da renderujes 3D stvari, ta referenca se dobije kad u konstruktoru pozoves React.createRef();
// - ta referenca se prosledjuje objektu koji je napravljen po modelu klase ViewGL (to smo mi napravili u viewgl.js fajlu)
// - referenca se u klasi ViewGL prosledjuje kao argument renderer objektu koji nam omogucava da crtamo stvari na ekran
// - sve promenljive koje su do sad bile globalne su sad polja u klasi koja je komponenta, pa im se pristupa preko this.imePromenljive
// - objekti mogu da se dodaju u scenu konstruktoru, update funkciji ili bilo kojoj custom funkciju koju recimo dodas kao listener negde (to je ove uradjeno u componentDidMount funkciji)

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
      <div>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}