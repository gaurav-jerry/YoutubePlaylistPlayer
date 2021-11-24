
import {useEffect, useState, useRef} from 'react'
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import { FaGooglePlay } from 'react-icons/fa';
//import playIcon from './images/'

function App() {
  const [songs, setsongs] = useState([]);
  const [currentPlaying, setcurrentPlaying] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
     axios({
      url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=200&playlistId=PLcjXjwgJpOzZoOYXz8y3I2PE_HspGkUry&key=AIzaSyA43Saqt5kUkQwm-BV_tWWwgA8HP5bwbXE',
      method: 'get'
    }).then(response => setsongs(response.data.items));
    //console.log(songs);
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
  return (
    <div className = {'app-wrapper'}> 
    <div ref={myRef} >
    {currentPlaying && <YouTube videoId={currentPlaying.contentDetails.videoId} opts={opts} />}
    </div>
    
    <div className = {'list-container'}>
      {songs.map(item => <div key  = {item.id}>{
        item.snippet.thumbnails.default && 
        <div className = {'List-Item'}>
          <img alt = 'video-thumbnail'  src = {item.snippet.thumbnails.default.url} />
          <div className = {'list-title'}>{item.snippet.title}</div>
          <div className = {'list-item-action-btn'}  onClick = {() => onPlayBtnClick(item)}><FaGooglePlay/></div>
        </div>
        }</div>)}
    </div>
    </div>
  );
}

export default App;
