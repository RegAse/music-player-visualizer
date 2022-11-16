import './App.css';
import { BsFillPauseFill, BsFillPlayFill, BsFillVolumeUpFill, BsFillVolumeOffFill, BsList, BsFillArrowLeftSquareFill } from "react-icons/bs";
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

  const [showSidebar, setShowSidebar] = useState(true);
  const [currentSong, setCurrentSong] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);// range 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [search, setSearch] = useState("");

  const filteredSongs = songs.filter(
    song => {
      return (
        song.title.toLowerCase()
          .includes(search.toLowerCase())
      );
    }
  );

  useEffect(() => {
    if (isPlaying) {
      if (visualizer == undefined) {
        visualizer = Visualizer();
      }
      visualizer.onChange(volume / 100);
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
    setShowSidebar(false);
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
    setCurrentTime((e.currentTarget.currentTime / e.currentTarget.duration) * 100);
    setDuration(e.currentTarget.duration);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  return (
    <div>
      <div className='app-container'>
        <a className='sidebar-expand' onClick={() => setShowSidebar(!showSidebar)} style={showSidebar ? {opacity: 0} : {opacity: 1}}><BsList></BsList></a>
        <div className='app-sidebar' style={showSidebar ? {width: "20em", opacity: 1} : {width: "0em", opacity: 0}}>
          <BsFillArrowLeftSquareFill onClick={() => setShowSidebar(!showSidebar)} className='app-sidebar-collapse'></BsFillArrowLeftSquareFill>
          <h2>Library</h2>
          <input className='library-search' placeholder='Search' type='text' onChange={handleSearch} />
          <div className='library-list'>
            {
              filteredSongs.map(song => (
                <div key={song.id} className='library-list-item d-flex' data-id={song.id} onClick={handleSelectSong}>
                  <img className='library-list-item-poster' src={song.poster} alt="Failed Loading" />
                  <div className='library-list-item-info'>
                    <p className='library-list-item-title'>{song.title}</p>
                    <p className='library-list-item-artist'>{song.artist}</p>
                  </div>
                </div>
              ))
            }
            {filteredSongs.length ? "" : "No Songs found: '" + search + "'"}
          </div>
        </div>
        <div className='app-content'>
          <div id='canvas-container' className='canvas-container'>
            {currentSong ?
              <div>
                {/* {currentSong.title} */}
                <audio id="audio" src={currentSong.file} onTimeUpdate={onUpdatePlaying}></audio>
              </div>
              :
              ""
            }
            <canvas id="main-visuals" className='main-visuals'></canvas>
            <div className='overlay'>

              {isPlaying ?
                <BsFillPauseFill className='action-buttons' onClick={handlePauseClick}></BsFillPauseFill>
                :
                <BsFillPlayFill className='action-buttons' onClick={handlePlayClick}></BsFillPlayFill>
              }
            </div>
            <div className='controls-right d-flex justify-content-between'>
              <div></div>
              <div></div>
              <div className='controls-volume d-flex align-items-center justify-content-center flex-column'>
                <BsFillVolumeUpFill></BsFillVolumeUpFill>
                <div className='slider-vertical-fixed-height always-on-top'>
                  <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className='slider slider-vertical' />
                </div>
                <BsFillVolumeOffFill></BsFillVolumeOffFill>
              </div>
            </div>
            <div className='controls-bottom d-flex align-items-end justify-content-center'>
              <div className='always-on-top'>
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
