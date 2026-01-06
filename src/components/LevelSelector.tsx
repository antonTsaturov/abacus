import { useContext } from "react";
import { AbacusContext } from "../wrappers/AbacusProvider";
import "../styles/LevelSelector.css";
import { LEVEL } from '../const/const';
import useNewGame from "../hooks/useNewGame";
import useReset from "../hooks/useReset";

export function LevelSelector() {
    const { level, setLevel } = useContext(AbacusContext)!;
    const {handleReset} = useReset();
    const {startNewGame} = useNewGame();
  
    
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10);
        setLevel(value);
        handleReset();
        startNewGame()
    };
    
    return (
        <div className="level-selector">
            <select 
                id="level-select"
                value={level}
                onChange={handleChange}
                className="level-dropdown"
            >
                {LEVEL.map((level) => (
                    <option key={level.id} value={level.id}>
                        {level.name}
                    </option>
                ))}
            </select>
        </div>
    );
}