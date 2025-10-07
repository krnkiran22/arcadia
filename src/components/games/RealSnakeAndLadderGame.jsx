import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Trophy, Dice6, Play, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage, Layer, Rect, Circle, Text, Line, Path, Group, Image as KonvaImage } from 'react-konva';

const RealSnakeAndLadderGame = ({ onBackToHome }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [botPosition, setBotPosition] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [diceValue, setDiceValue] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Traditional Snake and Ladder positions (classic board layout)
  const snakesAndLadders = {
    // Ladders (start: end) - Traditional positions from classic boards
    1: 38,   // Bottom left corner ladder
    4: 14,   // Early game ladder
    9: 31,   // Medium ladder
    21: 42,  // Mid-game ladder
    28: 84,  // Long ladder to top
    36: 44,  // Short ladder
    51: 67,  // Upper mid ladder
    71: 91,  // Near-end ladder
    80: 100, // Victory ladder

    // Snakes (start: end) - Traditional snake positions
    98: 78,  // Near-victory snake (most dangerous)
    95: 75,  // High position snake
    93: 73,  // Another high snake
    87: 24,  // Long snake fall
    64: 60,  // Mid-game snake
    62: 19,  // Long drop snake
    56: 53,  // Small snake
    49: 11,  // Major setback snake
    47: 26,  // Mid-game snake
    16: 6    // Early game snake
  };

  // Board dimensions
  const BOARD_SIZE = 600;
  const CELL_SIZE = BOARD_SIZE / 10;

  // Get position coordinates for a square number
  const getPositionCoords = (squareNum) => {
    if (squareNum === 0) return { x: CELL_SIZE / 2, y: BOARD_SIZE - CELL_SIZE / 2 };
    
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

  // Create board squares with proper numbering
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
    setGameLog(['🎯 Welcome to Snake & Ladder! Roll the dice to begin your adventure!']);
  };

  // Roll dice with animation
  const rollDice = () => {
    if (isRolling || gameOver || currentPlayer !== 'player' || !gameStarted) return;
    
    setIsRolling(true);
    
    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        movePlayer('player', finalValue);
        setIsRolling(false);
      }
    }, 100);
  };

  // Move player with proper game logic
  const movePlayer = (player, steps) => {
    const currentPos = player === 'player' ? playerPosition : botPosition;
    let newPos = currentPos + steps;
    
    // Don't go beyond 100 - need exact number to win
    if (newPos > 100) {
      newPos = currentPos;
      setGameLog(prev => [...prev, 
        `🎲 ${player === 'player' ? 'You' : 'Bot'} rolled ${steps} but can't move beyond 100! Need exact number to win.`
      ]);
      
      // Switch turns immediately if can't move
      setTimeout(() => {
        setCurrentPlayer(player === 'player' ? 'bot' : 'player');
      }, 1000);
      return;
    }
    
    // Normal move
    if (player === 'player') {
      setPlayerPosition(newPos);
    } else {
      setBotPosition(newPos);
    }
    
    setGameLog(prev => [...prev, 
      `🎲 ${player === 'player' ? 'You' : 'Bot'} rolled ${steps} and moved to position ${newPos}`
    ]);
    
    // Check for snakes and ladders after move
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
          `${isLadder ? '🪜' : '🐍'} ${player === 'player' ? 'You' : 'Bot'} ${isLadder ? 'climbed a ladder' : 'was bitten by a snake'} from ${newPos} to ${finalPos}!`
        ]);
        
        // Check for win after snake/ladder
        if (finalPos === 100) {
          setGameOver(true);
          setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
          setGameLog(prev => [...prev, `🏆 ${player === 'player' ? 'You' : 'Bot'} reached 100 and won the game!`]);
          return;
        }
      } else if (newPos === 100) {
        // Direct win without snake/ladder
        setGameOver(true);
        setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
        setGameLog(prev => [...prev, `🏆 ${player === 'player' ? 'You' : 'Bot'} reached 100 and won the game!`]);
        return;
      }
      
      // Switch turns
      setTimeout(() => {
        setCurrentPlayer(player === 'player' ? 'bot' : 'player');
      }, 500);
    }, 800);
  };

  // Bot turn with thinking delay
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

  // Enhanced snake rendering with realistic curves
  const renderSnake = (start, end) => {
    const startPos = getPositionCoords(start);
    const endPos = getPositionCoords(end);
    
    // Create curved snake body
    const controlPoint1X = startPos.x + (endPos.x - startPos.x) * 0.3;
    const controlPoint1Y = startPos.y - Math.abs(endPos.y - startPos.y) * 0.6;
    const controlPoint2X = startPos.x + (endPos.x - startPos.x) * 0.7;
    const controlPoint2Y = startPos.y - Math.abs(endPos.y - startPos.y) * 0.3;
    
    return (
      <Group key={`snake-${start}`}>
        {/* Snake body with gradient effect */}
        <Path
          data={`M ${startPos.x} ${startPos.y} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endPos.x} ${endPos.y}`}
          stroke="#228B22"
          strokeWidth={12}
          lineCap="round"
        />
        <Path
          data={`M ${startPos.x} ${startPos.y} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endPos.x} ${endPos.y}`}
          stroke="#32CD32"
          strokeWidth={8}
          lineCap="round"
        />
        
        {/* Snake head */}
        <Circle
          x={endPos.x}
          y={endPos.y}
          radius={10}
          fill="#FF4500"
          stroke="#8B0000"
          strokeWidth={2}
        />
        <Circle
          x={endPos.x - 3}
          y={endPos.y - 3}
          radius={2}
          fill="#000000"
        />
        <Circle
          x={endPos.x + 3}
          y={endPos.y - 3}
          radius={2}
          fill="#000000"
        />
        
        {/* Snake tail */}
        <Circle
          x={startPos.x}
          y={startPos.y}
          radius={6}
          fill="#228B22"
        />
        
        {/* Snake pattern spots */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const spotX = startPos.x + (endPos.x - startPos.x) * t;
          const spotY = startPos.y + (endPos.y - startPos.y) * t - Math.sin(t * Math.PI) * 20;
          return (
            <Circle
              key={i}
              x={spotX}
              y={spotY}
              radius={3}
              fill="#8B0000"
            />
          );
        })}
      </Group>
    );
  };

  // Enhanced ladder rendering with realistic 3D effect
  const renderLadder = (start, end) => {
    const startPos = getPositionCoords(start);
    const endPos = getPositionCoords(end);
    
    const rungs = 6;
    
    return (
      <Group key={`ladder-${start}`}>
        {/* Ladder shadow */}
        <Line
          points={[startPos.x - 6, startPos.y + 2, endPos.x - 6, endPos.y + 2]}
          stroke="#8B4513"
          strokeWidth={8}
          opacity={0.3}
        />
        <Line
          points={[startPos.x + 10, startPos.y + 2, endPos.x + 10, endPos.y + 2]}
          stroke="#8B4513"
          strokeWidth={8}
          opacity={0.3}
        />
        
        {/* Main ladder sides */}
        <Line
          points={[startPos.x - 8, startPos.y, endPos.x - 8, endPos.y]}
          stroke="#DEB887"
          strokeWidth={6}
        />
        <Line
          points={[startPos.x + 8, startPos.y, endPos.x + 8, endPos.y]}
          stroke="#DEB887"
          strokeWidth={6}
        />
        
        {/* Ladder rungs with 3D effect */}
        {Array.from({ length: rungs }).map((_, i) => {
          const t = i / (rungs - 1);
          const rungY = startPos.y + t * (endPos.y - startPos.y);
          const rungStartX = startPos.x + t * (endPos.x - startPos.x);
          return (
            <Group key={i}>
              {/* Rung shadow */}
              <Line
                points={[rungStartX - 8, rungY + 1, rungStartX + 8, rungY + 1]}
                stroke="#8B4513"
                strokeWidth={5}
                opacity={0.3}
              />
              {/* Main rung */}
              <Line
                points={[rungStartX - 8, rungY, rungStartX + 8, rungY]}
                stroke="#DEB887"
                strokeWidth={4}
              />
              {/* Rung highlight */}
              <Line
                points={[rungStartX - 8, rungY - 1, rungStartX + 8, rungY - 1]}
                stroke="#F5DEB3"
                strokeWidth={2}
              />
            </Group>
          );
        })}
        
        {/* Ladder end caps */}
        <Circle x={startPos.x - 8} y={startPos.y} radius={3} fill="#8B4513" />
        <Circle x={startPos.x + 8} y={startPos.y} radius={3} fill="#8B4513" />
        <Circle x={endPos.x - 8} y={endPos.y} radius={3} fill="#8B4513" />
        <Circle x={endPos.x + 8} y={endPos.y} radius={3} fill="#8B4513" />
      </Group>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold mb-2">🐍 Real Snake & Ladder 🪜</h1>
            <p className="text-emerald-200">Traditional board with realistic graphics</p>
          </div>
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>

        {!gameStarted ? (
          /* Welcome Screen */
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-16 text-center max-w-3xl border border-white/20">
              <div className="text-9xl mb-8">🎲</div>
              <h2 className="text-white text-5xl font-bold mb-8">Welcome to Snake & Ladder!</h2>
              <div className="text-white/90 text-xl mb-8 leading-relaxed space-y-4">
                <p>🎯 <strong>Objective:</strong> Be the first to reach square 100!</p>
                <p>🪜 <strong>Ladders:</strong> Climb up to advance faster</p>
                <p>🐍 <strong>Snakes:</strong> Watch out! They'll bring you down</p>
                <p>🎲 <strong>Rules:</strong> Need exact number to reach 100</p>
              </div>
              <div className="flex justify-center space-x-8 mb-8 text-6xl">
                <div>🪜</div>
                <div>🐍</div>
                <div>🎯</div>
              </div>
              <button
                onClick={startGame}
                className="flex items-center space-x-4 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black px-12 py-6 rounded-2xl text-2xl font-bold mx-auto transition-all transform hover:scale-110 shadow-2xl"
              >
                <Play className="w-8 h-8" />
                <span>Start Your Adventure!</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Game Info Panel */}
            <div className="space-y-6">
              {/* Players Status */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-white text-2xl font-bold mb-6 text-center">🏁 Players</h2>
                
                <div className="space-y-4">
                  <div className={`bg-white/10 rounded-xl p-5 border-2 transition-all transform ${
                    currentPlayer === 'player' ? 'border-lime-400 bg-lime-400/20 scale-105' : 'border-transparent'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-lg">You 😊</span>
                      <span className="text-lime-400 font-bold text-2xl">{playerPosition}</span>
                    </div>
                    <div className="text-xs text-white/60">
                      {100 - playerPosition} squares to victory
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-lime-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${playerPosition}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className={`bg-white/10 rounded-xl p-5 border-2 transition-all transform ${
                    currentPlayer === 'bot' ? 'border-red-400 bg-red-400/20 scale-105' : 'border-transparent'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-lg">Bot 🤖</span>
                      <span className="text-red-400 font-bold text-2xl">{botPosition}</span>
                    </div>
                    <div className="text-xs text-white/60">
                      {100 - botPosition} squares to victory
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${botPosition}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dice Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-white text-2xl font-bold mb-6 text-center">🎲 Dice</h2>
                
                <div className="text-center">
                  <motion.div
                    animate={isRolling ? { 
                      rotate: [0, 90, 180, 270, 360],
                      scale: [1, 1.1, 1, 1.1, 1]
                    } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
                    className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl font-bold mx-auto mb-6 shadow-2xl border-4 border-gray-300"
                  >
                    {diceValue || '?'}
                  </motion.div>
                  
                  <button
                    onClick={rollDice}
                    disabled={isRolling || gameOver || currentPlayer !== 'player'}
                    className={`
                      flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all w-full justify-center transform text-lg
                      ${currentPlayer === 'player' && !gameOver && !isRolling
                        ? 'bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black cursor-pointer hover:scale-105 shadow-lg'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <Dice6 className="w-6 h-6" />
                    <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="text-white/90 text-lg font-semibold">
                    {gameOver ? '🏆 Game Over!' : 
                     currentPlayer === 'player' ? '✨ Your Turn!' : '🤖 Bot is thinking...'}
                  </div>
                </div>
              </div>

              {/* Game Legend */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-white text-xl font-bold mb-4">📋 Legend</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                      <ArrowUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Ladder Start (Climb Up!)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                      <ArrowDown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Snake Head (Fall Down!)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center text-xs font-bold">
                      100
                    </div>
                    <span className="text-white">Victory Square</span>
                  </div>
                </div>
              </div>

              {/* Game Status */}
              {gameOver && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-center border border-white/20"
                >
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-white" />
                  <div className="text-white">
                    <div className="font-bold text-2xl mb-2">Game Over!</div>
                    <div className="text-xl">{winner}</div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Game Board */}
            <div className="xl:col-span-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="mb-6 text-center">
                  <div className="text-white text-2xl font-bold mb-3">
                    🎯 Race to Square 100!
                  </div>
                  <div className="text-white/80 text-lg">
                    Traditional Snake & Ladder board with realistic graphics
                  </div>
                </div>
                
                {/* Konva Canvas Board */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-amber-100 to-yellow-200 p-6 rounded-3xl border-8 border-amber-700 shadow-2xl">
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
                                square.isLadderStart ? '#22C55E' :
                                square.isSnakeStart ? '#EF4444' :
                                ((Math.floor(square.x / CELL_SIZE) + Math.floor(square.y / CELL_SIZE)) % 2 === 0 ? '#F8F9FA' : '#E9ECEF')
                              }
                              stroke="#6B7280"
                              strokeWidth={2}
                            />
                            <Text
                              x={square.x + CELL_SIZE / 2}
                              y={square.y + CELL_SIZE / 2}
                              text={square.number.toString()}
                              fontSize={16}
                              fontStyle="bold"
                              fill="#1F2937"
                              offsetX={square.number > 9 ? 10 : 5}
                              offsetY={8}
                            />
                          </Group>
                        ))}

                        {/* Snakes and Ladders with realistic graphics */}
                        {Object.entries(snakesAndLadders).map(([start, end]) => {
                          const isLadder = parseInt(end) > parseInt(start);
                          return isLadder ? 
                            renderLadder(parseInt(start), parseInt(end)) :
                            renderSnake(parseInt(start), parseInt(end));
                        })}

                        {/* Player tokens with glow effect */}
                        {playerPosition > 0 && (
                          <Group>
                            <Circle
                              x={getPositionCoords(playerPosition).x}
                              y={getPositionCoords(playerPosition).y - 10}
                              radius={18}
                              fill="#3B82F6"
                              stroke="#FFFFFF"
                              strokeWidth={4}
                              shadowColor="#3B82F6"
                              shadowBlur={10}
                              shadowOpacity={0.6}
                            />
                            <Text
                              x={getPositionCoords(playerPosition).x}
                              y={getPositionCoords(playerPosition).y - 10}
                              text="😊"
                              fontSize={20}
                              offsetX={10}
                              offsetY={10}
                            />
                          </Group>
                        )}
                        
                        {botPosition > 0 && (
                          <Group>
                            <Circle
                              x={getPositionCoords(botPosition).x}
                              y={getPositionCoords(botPosition).y + 10}
                              radius={18}
                              fill="#EF4444"
                              stroke="#FFFFFF"
                              strokeWidth={4}
                              shadowColor="#EF4444"
                              shadowBlur={10}
                              shadowOpacity={0.6}
                            />
                            <Text
                              x={getPositionCoords(botPosition).x}
                              y={getPositionCoords(botPosition).y + 10}
                              text="🤖"
                              fontSize={20}
                              offsetX={10}
                              offsetY={10}
                            />
                          </Group>
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
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white text-2xl font-bold mb-4">📜 Game Activity</h2>
            <div className="bg-black/20 rounded-xl p-4 max-h-48 overflow-y-auto">
              {gameLog.length === 0 ? (
                <div className="text-white/60 text-sm">Game log will appear here...</div>
              ) : (
                <div className="space-y-2">
                  {gameLog.slice(-10).map((log, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-white/90 text-sm bg-white/5 rounded-lg px-4 py-2 border border-white/10"
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

export default RealSnakeAndLadderGame;