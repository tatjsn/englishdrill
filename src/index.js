import './index.css';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/firestore';
import render from './render';

firebase.initializeApp({
  apiKey: 'AIzaSyD9G7Mguzxb3hdzAtiEiWzM550DXknwcVU',
  authDomain: 'englishdrill-43d5a.firebaseapp.com',
  projectId: 'englishdrill-43d5a'
});

const docRef = firebase.firestore()
  .collection('weeks')
  .doc('hlmczNxBeuBCoxnZiSNr');

function speak (msg) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance();
  m.lang = 'en-GB';
  m.rate = 1.0;
  m.text = msg;
  window.speechSynthesis.speak(m);
}

render(App, document.getElementById('root'), docRef, speak);

document.getElementById('loading').setAttribute('style', 'display: none');
