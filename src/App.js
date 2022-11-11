import './App.css';
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { Visualizer } from './components/Visualizer';

window.onload = function () {
  // Visualizer();
  const wait1 = setTimeout(Visualizer, 1);
}

function App() {


  return (
    <div className="App">
      <div className='sidebar-left'>
        <h2>Library</h2>
        <input className='library-search' placeholder='Search' type="text"/>
        <div className='library-list'>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
          <div className='library-list-item d-flex'>
            <img className='library-list-item-poster' src='./images/music-poster-1.png' />
            <div className='library-list-item-info'>
              <p className='library-list-item-title'>Tone of The Wind</p>
              <p className='library-list-item-artist'>GA</p>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='screen-center'>
          <div className='col-md-7'>
            <div id='canvas-container'>
              <div className='overlay'>
                {/* <img src='background-3.jpeg' /> */}
                {/* <img src="./images/starfield1.png" alt="Failed loading..." />  */}
                <BsFillPauseFill></BsFillPauseFill>
                {/* <h1></h1> */}
                {/* <h1><BsFillPlayFill></BsFillPlayFill></h1> */}
              </div>
              <canvas id="main-visuals" className='main-visuals'></canvas>
              <audio id="audio"></audio>
              <input type="file" id="thefile" accept="audio/*" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
