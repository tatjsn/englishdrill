import React, { useState, useEffect } from 'react';
import shuffle from 'lodash.shuffle';
import './App.css';

function App({ db, speak }) {
  const [score, setScore] = useState(-1);
  const [items, setItems] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const ref = db
      .collection('weeks')
      .doc('hnfRsBB7ALdfyEgdj7wK');
    return ref.onSnapshot((doc) => {
      const data = doc.data();
      setScore(data.score);
      setItems(data.items);
      if (questions.length === 0) {
        setQuestions(shuffle([...data.items.keys()]));
      }
    });
  }, []); // Do not rerun

  if (score === -1 || items.length === 0 || questions.length === 0) {
    console.log('show fallback');
    return (
      <div>Now loading...</div>
    );
  }

  console.log('dbg', questions);
  const q = questions[0];
  const item = items[q];
  const nonQs = shuffle([...items.keys()].filter(x => x !== q)).slice(0,2);
  const answers = shuffle([q, ...nonQs]);

  return (
    <div>
      <div>score is {score}.</div>
      <img alt="question" width={200} height={200} src={item.image} onClick={() => speak(item.word)} />
      {answers.map(a => items[a]).map(item => (
        <li key={item.word}>{item.word}</li>
      ))}
    </div>
  );
}

export default App;
