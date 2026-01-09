import { useContext, useEffect, useState } from 'react';
import '../styles/Ball.css'
import { AbacusContext } from '../wrappers/AbacusProvider';
import { useSettings } from '../wrappers/SettingsProvider';
import { CLASSIC_BLACK } from '../const/const';

interface BallProps {
  position: number
  onMouseDown: (index: number, clientX: number) => void
  index: number
  ballSize: number
  isDragging: boolean
  abacWidth:number
  color:string
}

function Ball({ position, onMouseDown, index, ballSize, isDragging, abacWidth, color }: BallProps) {
  const { initialPos } = useContext(AbacusContext)!;
  const { settings } = useSettings();

  // Safely check if initialPos is an array and has at least 10 elements
  let ballPathLength: number = 0;
  if (Array.isArray(initialPos) && initialPos.length > 9 && typeof initialPos[9] === 'number') {
    ballPathLength = abacWidth - initialPos[9];
  }

  const [startPos, setStartPos] = useState<number>();

  useEffect(()=> {
    setStartPos(position)
  }, [])
  
  // if (!abacWidth) {
  //   return (<>{abacWidth}</>)
  // }

  return (
    <div 
      className={`ball-wrapper ${isDragging ? 'dragging' : ''} ${( startPos !== undefined && position + 20 >= startPos + ballPathLength) ? 'on-right' : '' }`}
      style={{ 
        left: `${position}px`,
      }}
    >
      <div 
        className="ball" 
        style={{ 
          width: `${ballSize}px`,
          height: `${ballSize * 1.5}px`,
          background: `${ settings.theme === 'classic' && 3 < index && index < 6 ? CLASSIC_BLACK : color}`
        }}
        //onMouseDown={handleMouseDown}
        onPointerDown={(e) => {
          e.preventDefault()
          onMouseDown(index, e.clientX)
        }}
      >
        <span className="ball-number"></span>
      </div>
    </div>
  )
}

export default Ball
