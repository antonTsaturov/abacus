import { useContext, useEffect, useState, useRef } from 'react';
import '../styles/Exercise.css';
import { AbacusContext } from '../wrappers/AbacusProvider';
import { formatNumber } from '../utils/utils';
import useExample from '../hooks/useExample';
import { useSettings } from '../wrappers/SettingsProvider';
import useReset from '../hooks/useReset';
//import { useSettings } from '../wrappers/SettingsProvider';

function Exercise() {
  const { countSum, newGame, level, setNewGame, setScore } = useContext(AbacusContext)!;
  const [isSuccess, setIsSuccess] = useState(false);
  const prevCountSumRef = useRef(countSum);
  const resultRef = useRef<HTMLDivElement>(null);
  const example  = useExample({ level, newGame });
  const { settings } = useSettings();
  const {handleReset} = useReset();

  useEffect(() => {
    if (countSum !== prevCountSumRef.current) {
      const isCorrect = example && countSum === example.answer;
      if (isCorrect) {
        setIsSuccess(true);
        // Update count only in a mode 'ascent'
        settings.mode === 'ascent' && setScore(countSum)
        setTimeout(()=> {
          setNewGame(true);
          setIsSuccess(false);
          settings.mode === 'common' && handleReset();
        }, 1800);
      } else {
        setIsSuccess(false);
      }
    }
    prevCountSumRef.current = countSum;
  }, [countSum, example, newGame]);

  return (
    <div className="exercise-container">

      <div className="square">
        <div className="content" key={example?.num1}>{example && formatNumber(example?.num1)}</div>
      </div>

      <span className='symbol operator'>{example?.operation}</span>

      <div className="square">
        <div className="content" key={example?.num2}>{example && formatNumber(example?.num2)}</div>
      </div>

      <span className='symbol'>=</span>

      <div 
        ref={resultRef}
        className={`square result ${isSuccess ? 'success' : ''}`}
      >
        <div className="content" key={example?.answer}>{example ? (countSum === example.answer ? formatNumber(example.answer) : '?') : ''}</div>
      </div>
    </div>
  );
}

export default Exercise;