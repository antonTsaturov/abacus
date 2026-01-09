import Row from './Row';
import Exercise from './Exercise';
import { AbacusContext } from '../wrappers/AbacusProvider';
import ResetButton from './ResetButton';
import { LevelSelector } from './LevelSelector';
import { useContext } from 'react';
import { LEVEL, COLORS } from '../const/const';
import NewExercise from './NewExerciseButton';
import Menu from './Menu';
import { useSettings } from '../wrappers/SettingsProvider';
import Help from './Help';


function Game() {
  const { level } = useContext(AbacusContext)!;
  const { settings } = useSettings();
  const BALL_COLORS = COLORS.find(color => color.name === settings.theme)?.value;

  // Rows depend from level: beginer - 3 rows, intermediate - 4 rows, etc
  const rows = Array.from({ length: LEVEL[level].rows }, (_, i = 0) => i + 1).reverse()

  return (
    <div style={{display:'contents'}}>
        <Menu />
        <Exercise />
        {rows.map((rowNumber, index) => (
                <Row rowNumber={rowNumber} key={rowNumber} color={ BALL_COLORS && BALL_COLORS[index % BALL_COLORS.length]}/>
        ))}
        <div className="buttons-block" style={{marginTop: '1rem'}}>
            {settings.mode === 'common' && (
                <>
                  <LevelSelector />
                  <NewExercise />
                </>
            )}               
            <ResetButton />
        </div>
        <Help />
    </div>
  )
}

export default Game

