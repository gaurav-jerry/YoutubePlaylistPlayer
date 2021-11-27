
import {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import { FaGooglePlay } from 'react-icons/fa';
import { BsShuffle } from 'react-icons/bs';
import {AiFillPauseCircle} from 'react-icons/ai'
import Header from './Header';

function App() {
  const [songs, setsongs] = useState([]);
  const [currentPlaying, setcurrentPlaying] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const myRef = useRef(null);

  useEffect(() => {
     axios({
      url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=200&playlistId=PLcjXjwgJpOzZoOYXz8y3I2PE_HspGkUry&key=AIzaSyA43Saqt5kUkQwm-BV_tWWwgA8HP5bwbXE',
      method: 'get'
    }).then(response => {
      setsongs(response.data.items);
    //  c
    });
    // to do play song after on e finish
  }, []);


  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const onPlayBtnClick = (item) => {
    document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setcurrentPlaying(item);
  }

  console.log(songs);

  const onShuffleClick = () => {
    const randomIndex = Math.floor((Math.random() * songs.length));
    setcurrentPlaying(songs[randomIndex]);
  }

  const onVideoEnd = () => {
    const idx = songs.findIndex((song) => {
      return song.id === currentPlaying.id
    })
    if(songs.length >=idx){
      setcurrentPlaying(songs[idx+1])
    }
  }

  const getActionIcon = (id) => {
    if(currentPlaying && currentPlaying.id === id && !isPaused){
      return <AiFillPauseCircle/>
    }
    return <FaGooglePlay/>
  }

  return (
    <div className = {'app-wrapper'}> 
    <Header />
    <div  title = {'Shuffle Playlist'} className = 'shuffle-btn' onClick = {onShuffleClick} ><BsShuffle /></div>
    <div ref={myRef} >
    {currentPlaying && <YouTube  onPause={() => setIsPaused(true)} onPlay={() => setIsPaused(false)} onEnd={onVideoEnd} videoId={currentPlaying.contentDetails.videoId} opts={opts} />}
    </div>

    <div className = {'list-container'}>
      {songs.map(item => <div key  = {item.id}>{
        item.snippet.thumbnails.default && 
        <div  onClick = {() => onPlayBtnClick(item)} className = {`List-Item ${currentPlaying?.id === item.id  && 'currentPlaying'}`}>
          <img alt = 'video-thumbnail'  src = {item.snippet.thumbnails.default.url} />
          <div className = {'list-title'}>{item.snippet.title}</div>
          <div className = {'list-item-action-btn'}>{getActionIcon(item.id)}</div>
        </div>
        }</div>)}
    </div>
    </div>
  );
}

export default App;
