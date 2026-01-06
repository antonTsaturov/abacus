import "../styles/ResetButton.css";
import useReset from "../hooks/useReset";
import useNewGame from '../hooks/useNewGame';

function NewExercise() {
  const {handleReset} = useReset();
  const {startNewGame} = useNewGame();
    
    return (
      <button className="reset-button" onClick={()=> {
        handleReset()
        startNewGame()
      }}>
        New Exercise
      </button>
    );
  }
  
export default NewExercise;