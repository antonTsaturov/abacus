import { useContext, useEffect, useState } from "react";
import { getExample } from "../utils/utils";
import { AbacusContext } from "../wrappers/AbacusProvider";
import { LEVEL } from '../const/const';
import { useSettings } from "../wrappers/SettingsProvider";

interface UseExampleProps {
    level: number,
    newGame: boolean
}

interface ExerciseExample {
    num1: number;
    num2: number;
    answer: number;
    operation: string;
}

export default function useExample(props: UseExampleProps) {
    const {level, setLevel, score} = useContext(AbacusContext)!;
    const [example, setExample] = useState<ExerciseExample>();
    const [prevResult, setPrevResult] = useState<number | undefined>()
    const { settings } = useSettings();


    useEffect(()=> {
        if (props.newGame) {
            const exercise = settings.mode !== 'ascent' || score === 0 ? getExample(props.level) : getExample(props.level, prevResult);
            setPrevResult(exercise.answer);
            setExample(exercise)

            // Increase level and add row 
            if (exercise.answer.toString().length > LEVEL[level].rows) {
                setLevel(level + 1)
            }
        }   
    }, [props.newGame])

    return example;

}