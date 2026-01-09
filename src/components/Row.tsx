import { useState, useCallback, useRef, useEffect, JSX, useContext } from 'react'
import Ball from './Ball'
import '../styles/Row.css'
import { BALL_COUNT, BALL_SIZES, MIN_SPACING, TRACK_WIDTH, DIGIT_VALUES } from '../const/const';
import { AbacusContext } from '../wrappers/AbacusProvider';
import { formatNumber, formatDigit } from '../utils/utils';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { useSettings } from '../wrappers/SettingsProvider';

interface RowProps {
  rowNumber: number;
  color:string | undefined;
}

function Row({ rowNumber, color }: RowProps): JSX.Element  {
  const { settings } = useSettings()!;
  const { initialPos, setInitialPos, registerResetFunction, updateRowValue, countSum } = useContext(AbacusContext)!;
  const windowWidth = useWindowWidth();
  const BALL_SIZE = windowWidth < 480 ? BALL_SIZES.mobile : windowWidth < 800 ?  BALL_SIZES.tablet : BALL_SIZES.desktop;
  const [count, setCount] = useState<number>(0);

  // Initialize balls with positions spaced evenly along the track
  const [ballPositions, setBallPositions] = useState<number[]>(() => {
    const positions: number[] = []
    const startX = 5
    for (let i = 0; i < BALL_COUNT; i++) {
      positions.push(startX + i * (BALL_SIZE + MIN_SPACING))
    }
    return positions    
  })


  const resetBallsPos = useCallback(() => {
    if (initialPos) {
      setBallPositions(initialPos as number[])
    }
  }, [initialPos])

  // Register reset function with the provider
  useEffect(() => {
    registerResetFunction(rowNumber, resetBallsPos)
  }, [rowNumber, resetBallsPos, registerResetFunction])

  
  useEffect(() => {
    setInitialPos(ballPositions);
  }, [])

  // Keep ref in sync with state
  useEffect(() => {
    ballPositionsRef.current = ballPositions
  }, [ballPositions])

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [lastMouseX, setLastMouseX] = useState<number>(0)
  const ballPositionsRef = useRef<number[]>(ballPositions)

  const [abacWidth, setAbacWidth] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    
    const calculateWidth = () => {
      const width = trackRef.current?.clientWidth || 0;
      const calculatedWidth = width - BALL_SIZE;
      setAbacWidth(calculatedWidth);
    };
    
    // Первоначальный расчет
    calculateWidth();
    
    // Подписка на изменение размеров окна
    window.addEventListener('resize', calculateWidth);
    
    return () => {
      window.removeEventListener('resize', calculateWidth);
    };
  }, [BALL_SIZE, windowWidth]);
  
  const updateBallPosition = useCallback((index: number, newPos: number): void => {
    setBallPositions(prevPositions => {
      // Update ref with latest positions
      ballPositionsRef.current = prevPositions
      const newPositions = [...prevPositions]
      const minDistance = BALL_SIZE + MIN_SPACING
      
      // Get actual track width from DOM
      const trackWidth = trackRef.current?.clientWidth || TRACK_WIDTH
      const maxPos = trackWidth - BALL_SIZE
      
      // Check boundaries (prevent moving off track)
      if (newPos < 0) {
        newPos = 0
      }
      if (newPos > maxPos) {
        newPos = maxPos
      }
      
      // Determine direction of movement
      const currentPos = newPositions[index]
      const movingRight = newPos > currentPos
      
      if (movingRight) {
        // Try to move the ball
        newPositions[index] = newPos
        
        // Then fix any overlaps by pushing balls to the right
        for (let i = index; i < BALL_COUNT - 1; i++) {
          if (newPositions[i] > newPositions[i + 1] - minDistance) {
            newPositions[i + 1] = newPositions[i] + minDistance
          }
        }
        
        // Check if last ball went out of bounds
        if (newPositions[BALL_COUNT - 1] > maxPos) {
          // If out of bounds, roll back and find the maximum possible position
          newPositions[BALL_COUNT - 1] = maxPos
          for (let i = BALL_COUNT - 2; i >= index; i--) {
            newPositions[i] = newPositions[i + 1] - minDistance
          }
        }
      } else {
        // Moving left
        if (index === 0) {
          // First ball, no left neighbor to worry about
          newPositions[index] = newPos
        } else {
          const leftNeighborPos = newPositions[index - 1]
          const minAllowedPos = leftNeighborPos + minDistance
          
          if (newPos >= minAllowedPos) {
            // No overlap, safe to move
            newPositions[index] = newPos
          } else {
            // Would overlap - need to push left neighbor(s)
            const overlap = minAllowedPos - newPos
            
            // Try to push balls to the left
            let canPush = true
            let leftmostAffected = index - 1
            // Check if we can push all necessary balls
            for (let i = index - 1; i >= 0; i--) {
              const proposedPos = newPositions[i] - overlap
              
              if (proposedPos < 0) {
                // Can't push further left (hit boundary)
                canPush = false
                break
              }
              
              // Check if this would cause overlap with ball to the left
              if (i > 0) {
                const leftOfThis = newPositions[i - 1]
                if (proposedPos < leftOfThis + minDistance) {
                  // Would overlap, need to push further
                  leftmostAffected = i - 1
                  continue
                }
              }
              
              // Found the leftmost ball we need to push
              leftmostAffected = i
              break
            }
            if (canPush) {
              // Push all affected balls to the left
              for (let i = leftmostAffected; i < index; i++) {
                
                newPositions[i] -= overlap
                // Ensure no overlap with left neighbor
                if (i > 0 && newPositions[i] < newPositions[i - 1] + minDistance) {
                  newPositions[i] = newPositions[i - 1] + minDistance
                }

              }
              newPositions[index] = newPos
            }
            // If can't push, don't update positions (ball stays in place)
          }
        }
      }
      
      // Final boundary check: ensure no ball exceeds track width
      for (let i = 0; i < BALL_COUNT; i++) {
        if (newPositions[i] + BALL_SIZE > trackWidth) {
          newPositions[i] = trackWidth - BALL_SIZE
        }
        if (newPositions[i] < 0) {
          newPositions[i] = 0
        }
      }
      
      return newPositions
    })
  }, [])

  const updateBallPositionByClick = useCallback((index: number): void => {
    
    //console.log('ballPositions: ', ballPositions)
    const offset = trackRef.current &&  trackRef.current.clientWidth - BALL_SIZE - ballPositions[9];

    setBallPositions(prevPositions => {

      ballPositionsRef.current = prevPositions
      const newPositions = [...prevPositions]

      const clickedBallPos = prevPositions[index]
      console.log(clickedBallPos, ballPositions)
      if (offset && clickedBallPos === ballPositions[index] ) {//< clickedBallPos + offset
        // Moving to the right
        //console.log('to right')
        for (let i = index; i <= 9; i++) {
          
          if (newPositions[i] !== ballPositions[i] + offset) {
            newPositions[i] = newPositions[i] + offset;
          }

          if (i === 9) {
            break;
          }
        }
      } else {
        // Moving to the left
         //console.log('to left')
        for (let i = index; i >= 0; i--) {
          if (offset && newPositions[i] === ballPositions[i] + offset) {
            newPositions[i] = newPositions[i] - offset;
          }

          if (i === 0) {
            break;
          }
        }
      }
      return newPositions
    })
    handleRowCounter()
  },[initialPos])


  const handleMouseDown = useCallback((index: number, clientX: number): void => {
    if (settings.moveByClick === true) {
      updateBallPositionByClick(index);
    } else {
      setLastMouseX(clientX);
    }
    setDraggingIndex(index);
  }, [settings.moveByClick])

  const handleMouseMove = useCallback((clientX: number): void => {
    if (draggingIndex === null || !trackRef.current) return
    // Use ref to get the most current position (accounts for collision adjustments)
    const currentPos = ballPositionsRef.current[draggingIndex]
    // Calculate delta from last mouse position to handle rapid movements correctly
    const deltaX = clientX - lastMouseX
    const newPos = currentPos + deltaX
    
    // Update last mouse position for next calculation
    setLastMouseX(clientX)
    
    // Get actual track width from DOM
    const trackWidth = trackRef.current.clientWidth
    const maxPos = trackWidth - BALL_SIZE
    
    // Constrain to track bounds
    const constrainedPos = Math.max(0, Math.min(newPos, maxPos))
    
    if (!settings.moveByClick) {
      updateBallPosition(draggingIndex, constrainedPos)
    } 
    
  }, [draggingIndex, lastMouseX, updateBallPosition])


  const handleMouseUp = useCallback((): void => {
    setDraggingIndex(null);
    handleRowCounter();
  }, [draggingIndex ]);

  const handleRowCounter = useCallback(() => {
    const ballWrappers = trackRef?.current?.children as HTMLCollectionOf<Element>;
    if (ballWrappers) {
      const currentCount = Array.from(ballWrappers).reduce(
        (count, element) => element.className.includes('on-right') ? count + 1 : count, 
        0
      );
      // Записываем значение в счетчик своего ряда
      const rowValue = currentCount * DIGIT_VALUES[rowNumber - 1];
      setCount(rowValue);
      // Отправляем значение в контекст
      updateRowValue(rowNumber, rowValue);
    }
  },[handleMouseUp])

  useEffect(() => {
    if (draggingIndex === null) return

    const onPointerMove = (e: PointerEvent): void => {
      handleMouseMove(e.clientX)
    }
  
    const onPointerUp = (): void => {
      handleMouseUp()
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      
    }
  }, [draggingIndex, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if(countSum === 0) {
      setCount(0)
    }
  }, [countSum])

  return (
    <div className="row-with-tips-container">
      {/* Левая часть с точкой */}
      <div className="left-section">
        {!settings.dotDivider && <span className='digits'>{formatDigit(rowNumber)}</span>}
        {settings.dotDivider && rowNumber % 3 === 0 && rowNumber < 9 && <div className='dot'></div>}
      </div>
      
      {/* Центральная часть с рядом */}
      <div className="row-container">
        <div className="track" ref={trackRef}>
          <div className="crossbar"/>
          {ballPositions.map((position, index) => (
            <Ball
              key={index}
              index={index}
              position={position}
              onMouseDown={handleMouseDown}
              ballSize={BALL_SIZE}
              isDragging={draggingIndex === index}
              abacWidth={abacWidth}
              color={color || ''}
            />
          ))}
        </div>
      </div>
      
      {/* Правая часть со счетом */}
      <span className='count' style={{ opacity: `${ settings.showRowSums ? 1 : 0 }` }}>{formatNumber(count)}</span>
    </div>
  );
}

export default Row;

