import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyD9G7Mguzxb3hdzAtiEiWzM550DXknwcVU',
  authDomain: 'englishdrill-43d5a.firebaseapp.com',
  projectId: 'englishdrill-43d5a'
});

const db = firebase.firestore();

const speak = voiceId => msg => new Promise((resolve) => {
  const m = new SpeechSynthesisUtterance();
  m.voice = window.speechSynthesis.getVoices()[voiceId];
  m.text = msg;
  m.onend = resolve;
  window.speechSynthesis.speak(m);
});

ReactDOM.render(<App db={db} speak={speak(0)}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
