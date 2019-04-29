import React, { useState, useEffect } from 'react';
import shuffle from 'lodash.shuffle';
import { css, cx } from 'emotion';

const main = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
  touch-action: manipulation;
  font-size: 3rem;
  padding: 1rem;
  font-family: 'Zilla Slab', serif;
`;

const title = css`
  margin-bottom: 1rem;
  font-weight: bold;
`;

const bigImage = css`
  margin: 2rem 0;
  width: 100%;
`;

const past = css`
  filter: grayscale(100%) blur(5px);
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
  display: flex;
  span, button {
    background-color: black;
    color: hotpink;
  }
`;

const overlaySpan = css`
  flex: 1 1;
`;

const controller = css`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1rem;
`;

const display = css`
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  padding: 0 1rem;
  border: solid black 1px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
`;

const button = css`
  flex: 0 0;
  padding: 0;
  border: 0;
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  text-align: center;
  border: solid black 1px;
`;

function App({ db, speak }) {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState('none');
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const ref = db
      .collection('weeks')
      .doc('hlmczNxBeuBCoxnZiSNr');
    return ref.onSnapshot((doc) => {
      const data = doc.data();
      setItems(data.items);
    });
  }, []); // Do not rerun

  function setupAnswer(updatedQuestions) {
    const q = updatedQuestions[0];
    const item = items[q];
    // const nonQs = shuffle([...items.keys()].filter(x => x !== q)).slice(0,2);
    // setAnswers(shuffle([q, ...nonQs]));
    setAnswers(shuffle(item.word.split('')));
  }

  function setupGame() {
    const updatedQuestions = shuffle([...items.keys()]);
    setQuestions(updatedQuestions);
    setupAnswer(updatedQuestions);
  }

  if (items.length === 0) {
    return (
      <div className={main}>Now loading...</div>
    );
  }

  if (questions.length === 0) {
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

  function handleClick(selectedOption) {
    const isCorrect = selectedOption.word === item.word;
    setResult(isCorrect ? 'right': 'wrong');
    speak(selectedOption.word);
    setTimeout(() => {
      setResult('none');
      if (isCorrect) {
        setScore(score + 1);
        const updatedQuestions = questions.slice(1);
        setInput([]);
        setQuestions(questions.slice(1));
        setupAnswer(updatedQuestions);
      }
    }, 1000);
  };

  function handleClickAlpha(alpha) {
    setInput([...input, alpha]);
  }

  function handleClickBack() {
    setInput(input.slice(0, -1));
  }

  function handleClickEnter() {
    const isCorrect = input.join('') === item.word;
    setResult(isCorrect ? 'right': 'wrong');
    speak(item.word);
    setTimeout(() => {
      setResult('none');
      if (isCorrect) {
        setScore(score + 1);
        setInput([]);
        setShowHelp(false);
        const updatedQuestions = questions.slice(1);
        setQuestions(questions.slice(1));
        setupAnswer(updatedQuestions);
      }
    }, 1000);
  }

  function handleClickHelp() {
    setScore(score - 1);
    setShowHelp(true);
  }

  const q = questions[0];
  const item = items[q];

  return (
    <div className={main}>
      <img className={cx(bigImage, { [past]: item.attribute === 'past' })} alt="question" src={item.image} onClick={() => speak(item.word)} />
      <div className={overlay}>
        <div className={overlaySpan}><span>score: {score}</span></div>
        { showHelp ? <div><span>[{item.word}]</span></div> : <button onClick={handleClickHelp}>Help</button> }
      </div>
      <div className={controller}>
        <div className={display}>
          {input.join('')}
        </div>
        {answers.map(alpha => (
          <button type="button" className={button} onClick={() => handleClickAlpha(alpha)}>{alpha}</button>
          /* <li key={option.word} onClick={() => handleClick(option)}> */
          /*   <button type="button" className={button}>{option.word}</button> */
          /* </li> */
        ))}
        <button type="button" className={button} onClick={handleClickBack}>&#128281;</button>
        <button type="button" className={button} onClick={handleClickEnter}>&#128077;</button>
      </div>
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
