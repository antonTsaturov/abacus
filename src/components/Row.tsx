import { useState, useCallback, useRef, useEffect, useMemo, JSX, useContext } from 'react'
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
  const { settings } = useSettings();
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
  const trackRef = useRef<HTMLDivElement>(null)
  const ballPositionsRef = useRef<number[]>(ballPositions)
  const abacWidth = useMemo(() => {
    if (!trackRef.current) return 0;
    return (trackRef.current.clientWidth - BALL_SIZE);
  }, [trackRef?.current?.clientWidth]); 

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
        // if (index === 9) {
        //   newPositions[index] = newPos
        // } else {
        //   const rightNeighborPos = newPositions[index + 1];
        //   const minAllowedPos = rightNeighborPos - minDistance

        //   if (newPos <= minAllowedPos) {
        //     // No overlap, safe to move
        //     newPositions[index] = newPos
        //   } else {
        //     // Would overlap - need to push right neighbor(s)
        //     const overlap = newPos - minAllowedPos;
            

        //     // Try to push balls to the right
        //     let canPush = true;
        //     let rightmostAffected = index + 1;

        //     // Check if we can push all necessary balls
        //     for (let i = index + 1; i <= 9; i++) {
        //       const proposedPos = newPositions[i] + overlap
        //       //console.log('proposedPos: ', proposedPos)
        //       if (proposedPos > maxPos) {
        //         // Can't push further left (hit boundary)
        //         canPush = false
        //         break
        //       }
              
        //       // Check if this would cause overlap with ball to the right
        //       if (i < 9) {
        //         const rightOfThis = newPositions[i + 1]
        //         console.log('R proposedPos: ', proposedPos, rightOfThis-minDistance)
        //         if (proposedPos > rightOfThis - minDistance - 5) {
        //           // Would overlap, need to push further
        //           rightmostAffected = i + 1
        //           continue
        //         }
        //       }
              
        //       // Found the right most ball we need to push
        //       rightmostAffected = i
        //       break
        //     }
            
        //     console.log('rightmostAffected: ', rightmostAffected)

        //     if (canPush) {
        //       // Push all affected balls to the right
        //       for (let i = BALL_COUNT - 1; i > index; i--) {
        //         const leftNeighbor = i > 0 ? newPositions[i - 1] : null
        //         if (leftNeighbor !== null) {
        //           const required = leftNeighbor + minDistance
        //           if (newPositions[i] < required) {
        //             newPositions[i] = required
        //           }
        //         }
        //       }
        //       newPositions[index] = newPos
        //     }            
        //   }
        // }
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
  }        //###########################
        // Moving right
        // newPositions[index] = newPos
        
        // // Push balls to the right to maintain minimum spacing
        // for (let i = index + 1; i < BALL_COUNT; i++) {
        //   const requiredPos = newPositions[i - 1] + minDistance
        //   if (newPositions[i] < requiredPos) {
        //     // Check if pushing would go off track
        //     if (requiredPos + BALL_SIZE > trackWidth) {
        //       // Can't push further, limit this ball's position
        //       if (index + 1 < BALL_COUNT) {
        //         const rightBallIndex = index + 1
        //         const ballsOnRight = BALL_COUNT - (rightBallIndex + 1)
        //         const abacWidth = trackWidth - BALL_SIZE
        //         const maxRightPosition = abacWidth - (MIN_SPACING * ballsOnRight) - (BALL_SIZE * ballsOnRight)
        //         // If the right ball is at its maximum position (has "on-right" class), prevent movement
        //         if (prevPositions[rightBallIndex] > maxRightPosition) {
        //           // Prevent this ball from moving
        //           return prevPositions
        //         }
        //       }
        //       const maxAllowedPos = newPositions[i] - minDistance
        //       newPositions[index] = Math.min(newPos, maxAllowedPos)
        //       break
        //     }
        //     newPositions[i] = requiredPos
        //   } else {
        //     // No more overlaps, we can stop
        //     break
        //   }
        // }
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

  const handleMouseDown = useCallback((index: number, clientX: number): void => {
    setDraggingIndex(index)
    setLastMouseX(clientX)
  }, [])

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
    
    updateBallPosition(draggingIndex, constrainedPos)
  }, [draggingIndex, lastMouseX, updateBallPosition])

  const handleMouseUp = useCallback((): void => {
    setDraggingIndex(null);
    
    // Пересчитываем счетчик прямо в обработчике
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
  }, [draggingIndex, trackRef?.current, rowNumber, updateRowValue]);


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
      <span className='count' style={{opacity: `${!settings.showRowSums && 0}`}}>{formatNumber(count)}</span>
    </div>
  );
}

export default Row;

