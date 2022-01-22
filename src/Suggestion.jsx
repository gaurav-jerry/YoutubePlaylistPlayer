import React,{useState} from 'react';
import emailjs from 'emailjs-com';

export default function Suggestion() {
    const [openSuggestion, setopenSuggestion] = useState(false);
    const [suggestionText, setsuggestionText] = useState('');

const  sendEmail = (e) =>{
    console.log(e);
    const templateParams = {
        to_name: 'Gaurav',
        from_name: 'emailforYoutubePlaylist player',
        message: suggestionText,
    };
    e.preventDefault(); 
      emailjs.send('service_y23odaj','template_u54o6xf', templateParams, 'user_RmCCLJAPq28Qv5EuqTKPC')
	.then((response) => {
	   console.log('SUCCESS!', response.status, response.text);
       setopenSuggestion(false);
       alert('Thanks! :) ');
       setsuggestionText('');
	}, (err) => {
	   console.log('FAILED...', err);
	});


  }
  
    return (
        openSuggestion ? <div className = 'suggestion-feedback suggestion-input-box'>
            <div className = 'form-area'>
                <label>Share your songs :)</label>
            <textarea className = 'sugg-textArea' placeholder = 'share link from youtube/spotify/wynk...' rows="5" value = {suggestionText} 
            onChange = {(e) => setsuggestionText(e.target.value)} />
            <div className = 'suggestion-action-btn'>
            <div className = {`submit-btn ${!suggestionText && 'disabled'}` } onClick = {suggestionText && sendEmail}>Submit</div>
            <div className = 'submit-btn suggestion-close-btn' onClick = {() => setopenSuggestion(false)}>Close</div>
            </div>
            </div>
        </div> : <div className = 'suggestion' onClick = {() => setopenSuggestion(true)}>Suggest a song?</div>
    )
}
