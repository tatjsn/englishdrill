import './index.css';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { render } from 'lit-html';

firebase.initializeApp({
  apiKey: 'AIzaSyD9G7Mguzxb3hdzAtiEiWzM550DXknwcVU',
  authDomain: 'englishdrill-43d5a.firebaseapp.com',
  projectId: 'englishdrill-43d5a'
});

const db = firebase.firestore();

const speak = voiceId => msg => new Promise((resolve) => {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance();
  m.lang = 'en-GB';
  m.rate = 1.0;
  m.text = msg;
  m.onend = resolve;
  window.speechSynthesis.speak(m);
});

const root = document.getElementById('root');
let state = App.initialState;
const dispatch = (key, value) => {
  state = {...state, [key]: value};
  update();
};
const setters = Object.keys(state).map(key => value => dispatch(key, value));
const update = () => {
  render(App(...Object.values(state), ...setters, speak), root);
};

update();

// after first rendering
const ref = db
  .collection('weeks')
  .doc('hlmczNxBeuBCoxnZiSNr');
ref.onSnapshot((doc) => {
  const data = doc.data();
  dispatch('items', data.items);
});
