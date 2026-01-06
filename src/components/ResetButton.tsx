import "../styles/ResetButton.css";
import useReset from "../hooks/useReset";


function ResetButton() {
    const {handleReset} = useReset();
  
    return (
      <button className="reset-button" onClick={handleReset}>
        <span className="reset-icon">↻</span>
        Reset
      </button>
    );
  }
  
export default ResetButton; 