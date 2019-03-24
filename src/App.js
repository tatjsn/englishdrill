import React, { useState, useEffect } from 'react';
import shuffle from 'lodash.shuffle';
import { css, cx } from 'emotion';

const fullScreen = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const bigText = css`
  color: white;
  font-size: 5rem;
`;

const hidden = css`
  display: none;
`;

function App({ db, speak }) {
  const [score, setScore] = useState(-1);
  const [items, setItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState('none');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const ref = db
      .collection('weeks')
      .doc('hnfRsBB7ALdfyEgdj7wK');
    return ref.onSnapshot((doc) => {
      const data = doc.data();
      setScore(data.score);
      setItems(data.items);
      setQuestions(shuffle([...data.items.keys()]));
    });
  }, []); // Do not rerun

  if (score === -1 || items.length === 0) {
    return (
      <div>Now loading...</div>
    );
  }

  if (questions.length === 0) {
    return (
      <div>
        <div>Good job!</div>
        <div>
          <button type="button" onClick={() => setQuestions(shuffle([...items.keys()]))}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[0];
  const item = items[q];

  if (answers.length === 0) {
    const nonQs = shuffle([...items.keys()].filter(x => x !== q)).slice(0,2);
    setAnswers(shuffle([q, ...nonQs]));
  }

  function handleClick(selectedOption) {
    const isCorrect = selectedOption.word === item.word;
    setResult(isCorrect ? 'right': 'wrong');
    speak(selectedOption.word);
    setTimeout(() => {
      setResult('none');
      if (isCorrect) {
        setScore(score + 1);
        setQuestions(questions.slice(1));
        setAnswers([]); // Generate in next loop
      }
    }, 1000);
  };

  return (
    <div>
      <div>score is {score}.</div>
      <img alt="question" width={200} height={200} src={item.image} onClick={() => speak(item.word)} />
      {answers.map(a => items[a]).map(option => (
        <li key={option.word} onClick={() => handleClick(option)}>
          <button type="button">{option.word}</button>
        </li>
      ))}
      <div className={cx(fullScreen, { [hidden]: result !== 'right'})}>
        <div className={bigText}>Well done!</div>
      </div>
      <div className={cx(fullScreen, { [hidden]: result !== 'wrong'})}>
        <div className={bigText}>Try again...</div>
      </div>
    </div>
  );
}

export default App;
