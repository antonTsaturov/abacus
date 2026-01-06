import { useContext } from "react";
import { AbacusContext } from "../wrappers/AbacusProvider";
import { LEVEL } from '../const/const';

export default function useReset() {
    const { level, resetBallsPos } = useContext(AbacusContext)!;

    const digits = Array.from({ length: LEVEL[level].rows}, (_, i = 0) => i + 1).reverse();
  
    const handleReset = () => {
      // Reset all rows and row values
      digits.forEach((rowNumber) => {
        resetBallsPos(rowNumber);
      });
    };


    return {handleReset}

}