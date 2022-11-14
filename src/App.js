import './App.css';
import { BsFillPauseFill, BsFillPlayFill, BsFillVolumeUpFill, BsFillVolumeOffFill } from "react-icons/bs";
import { Visualizer } from './components/Visualizer';
import { data } from "./data/LibraryData";
import { useEffect, useState } from 'react';

let visualizer;

window.onload = function () {
  // Visualizer();
  const wait1 = setTimeout(function () {
    visualizer = Visualizer();
  }, 1);
}

function App() {
  let songs = data["songs"];
  // let visualizer;// The problem is this should only be created once...

  const [currentSong, setCurrentSong] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);// range 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      if (visualizer == undefined) {
        visualizer = Visualizer();
      }
      visualizer.onChange(currentSong.file);
    }
  }, [currentSong]);

  function handleVolumeChange(e) {
    setVolume(e.target.value);
    visualizer.setVolume(e.target.value / 100);
  }

  function handleSeek(e) {
    console.log("Seek: " + e.target.value / 100);
    if (!isPlaying) {
      let audio = document.getElementById("audio");
      audio.play();
      setIsPlaying(true);
    }
    visualizer.seek(e.target.value / 100);
  }

  function handleSelectSong(e) {
    if (visualizer == undefined) {
      visualizer = Visualizer();
    }
    setCurrentSong(songs[e.currentTarget.dataset.id]);
    setIsPlaying(true);
  }

  function handlePauseClick() {
    let audio = document.getElementById("audio");
    audio.pause();
    setIsPlaying(false);
  }

  function handlePlayClick() {
    let audio = document.getElementById("audio");
    audio.play();
    setIsPlaying(true);
  }

  function onUpdatePlaying(e) {
    // console.log("Time: " + e.currentTarget.currentTime);
    setCurrentTime((e.currentTarget.currentTime / e.currentTarget.duration) * 100);
    setDuration(e.currentTarget.duration);
  }

  return (
    <div className="App">
      <div className='sidebar-left'>
        <h2>Library</h2>
        <input className='library-search' placeholder='Search' type="text" />
        <div className='library-list'>
          {
            songs.map(song => (
              <div key={song.id} className='library-list-item d-flex' data-id={song.id} onClick={handleSelectSong}>
                <img className='library-list-item-poster' src={song.poster} alt="Failed Loading" />
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
              <div className='controls-right'>
                <div className='controls-volume d-flex align-items-center justify-content-center flex-column'>
                  <BsFillVolumeUpFill></BsFillVolumeUpFill>
                  <div className='slider-vertical-fixed-height'>
                    <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className='slider slider-vertical' />
                  </div>
                  <BsFillVolumeOffFill></BsFillVolumeOffFill>
                </div>
              </div>
              <div className='overlay'>

                {isPlaying ?
                  <BsFillPauseFill onClick={handlePauseClick}></BsFillPauseFill>
                  :
                  <BsFillPlayFill onClick={handlePlayClick}></BsFillPlayFill>
                }
                {/* <h1><BsFillPlayFill></BsFillPlayFill></h1> */}
              </div>
              {currentSong ?
                <div>
                  {/* {currentSong.title} */}
                  <audio id="audio" src={currentSong.file} onTimeUpdate={onUpdatePlaying}></audio>
                </div>
                :
                ""
              }
              <canvas id="main-visuals" className='main-visuals'></canvas>
              <div className='controls-bottom d-flex align-items-center justify-content-center'>
                <span>{Math.floor(((duration / 100) * currentTime) % 3600 / 60).toString().padStart(1, '0') + ":" + Math.floor(((duration / 100) * currentTime) % 60).toString().padStart(2, '0')}</span>
                <input type="range" min="0" max="100" value={currentTime} onChange={handleSeek} className='slider slider-horizontal' />
                <span>{Math.floor(duration % 3600 / 60).toString().padStart(1, '0') + ":" + Math.floor(duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
