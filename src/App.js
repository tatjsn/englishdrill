import React, { useState, useEffect } from 'react';
import shuffle from 'lodash.shuffle';
import { css, cx } from 'emotion';

const main = css`
  position: relative;
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
  touch-action: manipulation;
  font-size: 3rem;
  padding: 1rem;
`;

const title = css`
  margin-bottom: 1rem;
  font-weight: bold;
`;

const bigImage = css`
  width: 100%;
`;

const fullScreen = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content:center;
  color: white;
  padding: 1rem;
`;

const hidden = css`
  display: none;
`;

const overlay = css`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1rem;
`;

const controller = css`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1rem;
`;

function App({ db, speak }) {
  const [score, setScore] = useState(0);
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
      setItems(data.items);
    });
  }, []); // Do not rerun

  if (items.length === 0) {
    return (
      <div className={main}>Now loading...</div>
    );
  }

  if (questions.length === 0) {
    function setupGame() {
      setQuestions(shuffle([...items.keys()]));
    }

    return (
      <div className={main}>
        <div className={title}>
          {score === 0 ? 'English drill!' : 'Good job!'}
        </div>
        <div>
          <button type="button" onClick={setupGame}>
            {score === 0 ? 'Start game' : 'Play again'}
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
    <div className={main}>
      <div className={overlay}>score: {score}</div>
      <img className={bigImage} alt="question" src={item.image} onClick={() => speak(item.word)} />
      <ul className={controller}>
        {answers.map(a => items[a]).map(option => (
          <li key={option.word} onClick={() => handleClick(option)}>
            <button type="button">{option.word}</button>
          </li>
        ))}
      </ul>
      <div className={cx(fullScreen, { [hidden]: result !== 'right'})}>
        <div>Well done!</div>
      </div>
      <div className={cx(fullScreen, { [hidden]: result !== 'wrong'})}>
        <div>Try again...</div>
      </div>
    </div>
  );
}

export default App;
