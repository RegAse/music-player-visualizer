import './App.css';
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { Visualizer } from './components/Visualizer';
import { data } from "./data/LibraryData";
import { useEffect, useState } from 'react';


window.onload = function () {
  // Visualizer();
  const wait1 = setTimeout(Visualizer, 1);
}

function App() {
  let songs = data["songs"];

  const [currentSong, setCurrentSong] = useState();

  useEffect(() => {
    Visualizer().onChange();
  });

  function handleClick(e) {
    console.log("Clicked on " + e.currentTarget.dataset.id);
    setCurrentSong(songs[e.currentTarget.dataset.id]);
  }

  return (
    <div className="App">
      <div className='sidebar-left'>
        <h2>Library</h2>
        <input className='library-search' placeholder='Search' type="text" />
        <div className='library-list'>
          {
            songs.map(song => (
              <div key={song.id} className='library-list-item d-flex' data-id={song.id} onClick={handleClick}>
                <img className='library-list-item-poster' src={song.poster} />
                <div className='library-list-item-info'>
                  <p className='library-list-item-title'>{song.title}</p>
                  <p className='library-list-item-artist'>{song.artist}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className='container'>
        <div className='screen-center'>
          <div className='col-md-7'>
            <div id='canvas-container'>
              <div className='overlay'>
                <BsFillPauseFill></BsFillPauseFill>
                {/* <h1><BsFillPlayFill></BsFillPlayFill></h1> */}
              </div>
              {currentSong ?
                <div>
                  {currentSong.title}
                  <audio id="audio" src={currentSong.file}></audio>
                </div>
                :
                ""
              }
              <canvas id="main-visuals" className='main-visuals'></canvas>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
