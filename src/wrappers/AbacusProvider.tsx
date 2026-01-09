import { createContext, JSX, SetStateAction, useState, useRef, useCallback, useEffect } from "react"

export type ContextType = {
    initialPos: SetStateAction<number[] | undefined>;
    setInitialPos:(value: number[]) => void;
    resetBallsPos: (rowNumber: number) => void;
    registerResetFunction: (rowNumber: number, resetFn: () => void) => void;
    countSum: number;
    rowValues: Record<number, number>;
    updateRowValue: (rowNumber: number, value: number) => void;
    resetRowValue: (rowNumber: number) => void;
    level: number;
    setLevel: (value: number) => void;
    newGame: boolean;
    setNewGame: (value: boolean) => void;
    score: number;
    setScore: (value: number) => void;
};

export const AbacusContext = createContext<ContextType | null>(null);

function AbacusProvider({ children }: { children: JSX.Element })  {

    const [initialPos, setInitialPos] = useState<number[]>();
    const [rowValues, setRowValues] = useState<Record<number, number>>({}); // {1: 0, 2: 0, 3: 0}
    const [countSum, setCountSum] = useState<number>(0);
    const resetFunctionsRef = useRef<Map<number, () => void>>(new Map());
    const [level, setLevel] = useState<number>(0)
    const [newGame, setNewGame] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0)

    // Вычисляем сумму при изменении значений рядов
    useEffect(() => {
        const sum = Object.values(rowValues).reduce((total, value) => total + value, 0);
        setCountSum(sum);
    }, [rowValues]);

    useEffect(()=> {
        if (newGame)
        setNewGame(false);
    }, [newGame])

    const updateRowValue = useCallback((rowNumber: number, value: number) => {
        setRowValues(prev => ({
            ...prev,
            [rowNumber]: value
        }));
    }, []);
    
    const registerResetFunction = useCallback((rowNumber: number, resetFn: () => void) => {
        resetFunctionsRef.current.set(rowNumber, resetFn);
    }, []);

    const resetBallsPos = useCallback((rowNumber: number) => {
        const resetFn = resetFunctionsRef.current.get(rowNumber);
        if (resetFn) {
            resetFn();
        }
        resetRowValue(rowNumber);
    }, []);

    // Сброс значения ряда при сбросе позиций
    const resetRowValue = useCallback((rowNumber: number) => {
        setRowValues(prev => ({
            ...prev,
            [rowNumber]: 0
        }));
    }, []);

    return (
        <AbacusContext value={{
            initialPos, 
            setInitialPos, 
            resetBallsPos, 
            registerResetFunction, 
            countSum,
            rowValues,
            updateRowValue,
            resetRowValue,
            level,
            setLevel,
            newGame,
            setNewGame,
            score,
            setScore
        }}>
            {children}
        </AbacusContext>
    )
}

export default AbacusProvider;