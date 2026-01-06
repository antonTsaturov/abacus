import { useContext } from "react";
import { AbacusContext } from "../wrappers/AbacusProvider";

export default function useNewGame() {
    const { setNewGame } = useContext(AbacusContext)!;

    const startNewGame = () => {
        setNewGame(true)
    }

    return {startNewGame}

}