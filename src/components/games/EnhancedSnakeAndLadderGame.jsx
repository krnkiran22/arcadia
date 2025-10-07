import React, { useState, useEffect, useRef } from 'react';
import { Home, RotateCcw, Trophy, Dice6, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage, Layer, Rect, Circle, Text, Line, Path, Group } from 'react-konva';

const EnhancedSnakeAndLadderGame = ({ onBackToHome }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [botPosition, setBotPosition] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [diceValue, setDiceValue] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Traditional Snake and Ladder positions (classic board)
  const snakesAndLadders = {
    // Ladders (start: end) - Traditional positions
    1: 38,   // Long ladder from bottom
    4: 14,   // Short ladder
    9: 31,   // Medium ladder
    16: 6,   // This is actually a snake, not ladder
    21: 42,  // Medium ladder
    28: 84,  // Very long ladder
    36: 44,  // Short ladder
    51: 67,  // Medium ladder
    71: 91,  // Long ladder near top
    80: 100, // Victory ladder
    
    // Snakes (start: end) - Traditional positions  
    98: 78,  // Near victory snake
    95: 75,  // High snake
    93: 73,  // High snake
    87: 24,  // Long snake
    64: 60,  // Medium snake
    62: 19,  // Long snake
    56: 53,  // Short snake
    49: 11,  // Very long snake
    47: 26,  // Medium snake
    16: 6    // Early snake
  };

  // Board dimensions
  const BOARD_SIZE = 500;
  const CELL_SIZE = BOARD_SIZE / 10;

  // Get position coordinates for a square number
  const getPositionCoords = (squareNum) => {
    if (squareNum === 0) return { x: 0, y: BOARD_SIZE - CELL_SIZE };
    
    const row = Math.floor((squareNum - 1) / 10);
    const col = (squareNum - 1) % 10;
    
    // Snake pattern - odd rows go right to left
    const actualCol = row % 2 === 0 ? col : 9 - col;
    const actualRow = 9 - row; // Board starts from bottom
    
    return {
      x: actualCol * CELL_SIZE + CELL_SIZE / 2,
      y: actualRow * CELL_SIZE + CELL_SIZE / 2
    };
  };

  // Create board squares
  const createBoard = () => {
    const squares = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const squareNum = row * 10 + col + 1;
        const actualCol = row % 2 === 0 ? col : 9 - col;
        const actualRow = 9 - row;
        
        squares.push({
          number: squareNum,
          x: actualCol * CELL_SIZE,
          y: actualRow * CELL_SIZE,
          isLadderStart: Object.keys(snakesAndLadders).includes(squareNum.toString()) && snakesAndLadders[squareNum] > squareNum,
          isSnakeStart: Object.keys(snakesAndLadders).includes(squareNum.toString()) && snakesAndLadders[squareNum] < squareNum,
          isFinish: squareNum === 100
        });
      }
    }
    return squares;
  };

  const boardSquares = createBoard();

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameLog(['Game started! Roll the dice to begin your adventure!']);
  };

  // Roll dice
  const rollDice = () => {
    if (isRolling || gameOver || currentPlayer !== 'player' || !gameStarted) return;
    
    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(value);
      movePlayer('player', value);
      setIsRolling(false);
    }, 1000);
  };

  // Move player
  const movePlayer = (player, steps) => {
    const currentPos = player === 'player' ? playerPosition : botPosition;
    let newPos = currentPos + steps;
    
    // Don't go beyond 100
    if (newPos > 100) {
      newPos = currentPos;
      setGameLog(prev => [...prev, 
        `${player === 'player' ? 'You' : 'Bot'} rolled ${steps} but can't move beyond 100! Need exact number to win.`
      ]);
    } else {
      // Normal move
      if (player === 'player') {
        setPlayerPosition(newPos);
      } else {
        setBotPosition(newPos);
      }
      
      setGameLog(prev => [...prev, 
        `${player === 'player' ? 'You' : 'Bot'} rolled ${steps} and moved to position ${newPos}`
      ]);
      
      // Check for snakes and ladders after a brief delay
      setTimeout(() => {
        if (snakesAndLadders[newPos]) {
          const finalPos = snakesAndLadders[newPos];
          const isLadder = finalPos > newPos;
          
          if (player === 'player') {
            setPlayerPosition(finalPos);
          } else {
            setBotPosition(finalPos);
          }
          
          setGameLog(prev => [...prev, 
            `${player === 'player' ? 'You' : 'Bot'} ${isLadder ? 'climbed a ladder 🪜' : 'was bitten by a snake 🐍'} from ${newPos} to ${finalPos}!`
          ]);
          
          // Check for win after snake/ladder
          if (finalPos === 100) {
            setGameOver(true);
            setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
            setGameLog(prev => [...prev, `${player === 'player' ? 'You' : 'Bot'} reached 100 and won the game!`]);
          }
        } else if (newPos === 100) {
          // Direct win without snake/ladder
          setGameOver(true);
          setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
          setGameLog(prev => [...prev, `${player === 'player' ? 'You' : 'Bot'} reached 100 and won the game!`]);
        }
      }, 500);
    }
    
    // Switch turns
    setTimeout(() => {
      setCurrentPlayer(player === 'player' ? 'bot' : 'player');
    }, 1000);
  };

  // Bot turn
  useEffect(() => {
    if (currentPlayer === 'bot' && !gameOver && gameStarted) {
      const timer = setTimeout(() => {
        const botRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(botRoll);
        movePlayer('bot', botRoll);
      }, 1500 + Math.random() * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, gameStarted]);

  // Reset game
  const resetGame = () => {
    setPlayerPosition(0);
    setBotPosition(0);
    setCurrentPlayer('player');
    setDiceValue(0);
    setIsRolling(false);
    setGameOver(false);
    setWinner(null);
    setGameLog([]);
    setGameStarted(false);
  };

  // Render snake path
  const renderSnake = (start, end) => {
    const startPos = getPositionCoords(start);
    const endPos = getPositionCoords(end);
    
    // Create a curved snake path
    const midX = (startPos.x + endPos.x) / 2;
    const midY = (startPos.y + endPos.y) / 2 - 30;
    
    return (
      <Group key={`snake-${start}`}>
        <Path
          data={`M ${startPos.x} ${startPos.y} Q ${midX} ${midY} ${endPos.x} ${endPos.y}`}
          stroke="#FF0000"
          strokeWidth={6}
          fill=""
        />
        {/* Snake head */}
        <Circle
          x={startPos.x}
          y={startPos.y}
          radius={8}
          fill="#FF0000"
          stroke="#8B0000"
          strokeWidth={2}
        />
        {/* Snake tail */}
        <Circle
          x={endPos.x}
          y={endPos.y}
          radius={6}
          fill="#FF4444"
        />
      </Group>
    );
  };

  // Render ladder
  const renderLadder = (start, end) => {
    const startPos = getPositionCoords(start);
    const endPos = getPositionCoords(end);
    
    return (
      <Group key={`ladder-${start}`}>
        {/* Ladder sides */}
        <Line
          points={[startPos.x - 8, startPos.y, endPos.x - 8, endPos.y]}
          stroke="#8B4513"
          strokeWidth={4}
        />
        <Line
          points={[startPos.x + 8, startPos.y, endPos.x + 8, endPos.y]}
          stroke="#8B4513"
          strokeWidth={4}
        />
        
        {/* Ladder rungs */}
        {Array.from({ length: 5 }).map((_, i) => {
          const t = i / 4;
          const rungY = startPos.y + t * (endPos.y - startPos.y);
          return (
            <Line
              key={i}
              points={[startPos.x - 8, rungY, startPos.x + 8, rungY]}
              stroke="#8B4513"
              strokeWidth={3}
            />
          );
        })}
      </Group>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </button>
          
          <h1 className="text-white text-3xl font-bold">🐍 Enhanced Snake & Ladder 🪜</h1>
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>

        {!gameStarted ? (
          /* Welcome Screen */
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center max-w-2xl">
              <div className="text-8xl mb-6">🎯</div>
              <h2 className="text-white text-4xl font-bold mb-6">Welcome to Snake & Ladder!</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Race against the bot to reach square 100 first! <br/>
                🪜 Climb ladders to go up faster <br/>
                🐍 Avoid snakes that will bring you down <br/>
                🎲 Roll the dice and let fortune decide your fate!
              </p>
              <button
                onClick={startGame}
                className="flex items-center space-x-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black px-8 py-4 rounded-xl text-xl font-bold mx-auto transition-all transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                <span>Start Adventure!</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Game Info Panel */}
            <div className="space-y-6">
              {/* Players Status */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Players</h2>
                
                <div className="space-y-3">
                  <div className={`bg-white/10 rounded-lg p-4 border-2 transition-all ${
                    currentPlayer === 'player' ? 'border-lime-400 bg-lime-400/20' : 'border-transparent'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">You 😊</span>
                      <span className="text-lime-400 font-bold text-lg">{playerPosition}</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {100 - playerPosition} squares to win
                    </div>
                  </div>
                  <div className={`bg-white/10 rounded-lg p-4 border-2 transition-all ${
                    currentPlayer === 'bot' ? 'border-red-400 bg-red-400/20' : 'border-transparent'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Bot 🤖</span>
                      <span className="text-red-400 font-bold text-lg">{botPosition}</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {100 - botPosition} squares to win
                    </div>
                  </div>
                </div>
              </div>

              {/* Dice */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">🎲 Dice</h2>
                
                <div className="text-center">
                  <motion.div
                    animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                    className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg"
                  >
                    {diceValue || '?'}
                  </motion.div>
                  
                  <button
                    onClick={rollDice}
                    disabled={isRolling || gameOver || currentPlayer !== 'player'}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all w-full justify-center transform
                      ${currentPlayer === 'player' && !gameOver && !isRolling
                        ? 'bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black cursor-pointer hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <Dice6 className="w-5 h-5" />
                    <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-white/80 text-sm">
                    {gameOver ? 'Game Over!' : 
                     currentPlayer === 'player' ? 'Your Turn!' : 'Bot is playing...'}
                  </div>
                </div>
              </div>

              {/* Game Status */}
              {gameOver && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-3 text-white text-center">
                    <Trophy className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-xl">Game Over!</div>
                      <div className="text-lg">{winner}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Game Board */}
            <div className="xl:col-span-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="mb-4 text-center">
                  <div className="text-white text-xl font-bold mb-2">
                    🎯 Race to Square 100!
                  </div>
                  <div className="text-white/80 text-sm">
                    Use ladders to climb up, avoid snakes that bring you down!
                  </div>
                </div>
                
                {/* Konva Canvas Board */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl border-4 border-green-700">
                    <Stage width={BOARD_SIZE} height={BOARD_SIZE}>
                      <Layer>
                        {/* Board squares */}
                        {boardSquares.map((square) => (
                          <Group key={square.number}>
                            <Rect
                              x={square.x}
                              y={square.y}
                              width={CELL_SIZE}
                              height={CELL_SIZE}
                              fill={
                                square.isFinish ? '#FFD700' :
                                square.isLadderStart ? '#10B981' :
                                square.isSnakeStart ? '#EF4444' :
                                (square.number % 2 === 0 ? '#F3F4F6' : '#E5E7EB')
                              }
                              stroke="#374151"
                              strokeWidth={1}
                            />
                            <Text
                              x={square.x + CELL_SIZE / 2}
                              y={square.y + CELL_SIZE / 2}
                              text={square.number.toString()}
                              fontSize={14}
                              fontStyle="bold"
                              fill="#1F2937"
                              offsetX={square.number > 9 ? 8 : 4}
                              offsetY={7}
                            />
                          </Group>
                        ))}

                        {/* Snakes and Ladders */}
                        {Object.entries(snakesAndLadders).map(([start, end]) => {
                          const isLadder = parseInt(end) > parseInt(start);
                          return isLadder ? 
                            renderLadder(parseInt(start), parseInt(end)) :
                            renderSnake(parseInt(start), parseInt(end));
                        })}

                        {/* Player tokens */}
                        {playerPosition > 0 && (
                          <Circle
                            x={getPositionCoords(playerPosition).x}
                            y={getPositionCoords(playerPosition).y - 8}
                            radius={12}
                            fill="#3B82F6"
                            stroke="#FFFFFF"
                            strokeWidth={3}
                          />
                        )}
                        
                        {botPosition > 0 && (
                          <Circle
                            x={getPositionCoords(botPosition).x}
                            y={getPositionCoords(botPosition).y + 8}
                            radius={12}
                            fill="#EF4444"
                            stroke="#FFFFFF"
                            strokeWidth={3}
                          />
                        )}
                      </Layer>
                    </Stage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Log */}
        {gameStarted && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">📜 Game Log</h2>
            <div className="bg-black/20 rounded-lg p-4 max-h-40 overflow-y-auto">
              {gameLog.length === 0 ? (
                <div className="text-white/60 text-sm">Game log will appear here...</div>
              ) : (
                <div className="space-y-2">
                  {gameLog.slice(-8).map((log, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-white/90 text-sm bg-white/5 rounded px-3 py-1"
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSnakeAndLadderGame;