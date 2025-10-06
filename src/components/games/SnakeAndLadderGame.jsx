import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Trophy, Dice6 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SnakeAndLadderGame = ({ onBackToHome }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [botPosition, setBotPosition] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('player'); // 'player' or 'bot'
  const [diceValue, setDiceValue] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameLog, setGameLog] = useState([]);

  // Snakes and Ladders positions (matching BabyLigerFE)
  const snakesAndLadders = {
    // Ladders (start: end)
    1: 38, 4: 14, 8: 30, 21: 42, 28: 76, 50: 67, 71: 92, 80: 99,
    // Snakes (start: end)  
    32: 10, 36: 6, 48: 26, 62: 18, 88: 24, 95: 56, 97: 78
  };

  // Create board squares (100 squares, numbered 1-100)
  const createBoard = () => {
    const board = [];
    for (let row = 9; row >= 0; row--) {
      const squares = [];
      for (let col = 0; col < 10; col++) {
        const squareNumber = row % 2 === 1 ? 
          row * 10 + col + 1 : 
          row * 10 + (10 - col);
        squares.push(squareNumber);
      }
      board.push(squares);
    }
    return board;
  };

  const board = createBoard();

  // Roll dice
  const rollDice = () => {
    if (isRolling || gameOver || currentPlayer !== 'player') return;
    
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
    }
    
    // Check for snakes and ladders
    if (snakesAndLadders[newPos]) {
      const finalPos = snakesAndLadders[newPos];
      const isLadder = finalPos > newPos;
      
      setTimeout(() => {
        if (player === 'player') {
          setPlayerPosition(finalPos);
        } else {
          setBotPosition(finalPos);
        }
        
        setGameLog(prev => [...prev, 
          `${player === 'player' ? 'You' : 'Bot'} ${isLadder ? 'climbed a ladder' : 'hit a snake'} from ${newPos} to ${finalPos}!`
        ]);
        
        // Check for win
        if (finalPos === 100) {
          setGameOver(true);
          setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
        }
      }, 500);
    } else {
      if (player === 'player') {
        setPlayerPosition(newPos);
      } else {
        setBotPosition(newPos);
      }
      
      if (newPos === 100) {
        setGameOver(true);
        setWinner(player === 'player' ? 'You Win! 🎉' : 'Bot Wins! 🤖');
      }
    }
    
    setGameLog(prev => [...prev, 
      `${player === 'player' ? 'You' : 'Bot'} rolled ${steps} and moved to position ${newPos > 100 ? currentPos : newPos}`
    ]);
    
    // Switch turns
    setCurrentPlayer(player === 'player' ? 'bot' : 'player');
  };

  // Bot turn
  useEffect(() => {
    if (currentPlayer === 'bot' && !gameOver) {
      const timer = setTimeout(() => {
        const botRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(botRoll);
        movePlayer('bot', botRoll);
      }, 1000 + Math.random() * 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver]);

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
  };

  // Get square style based on special positions
  const getSquareStyle = (squareNum) => {
    let baseStyle = "relative flex items-center justify-center text-xs font-bold border border-green-600 ";
    
    if (squareNum === 100) {
      baseStyle += "bg-yellow-500 text-black ";
    } else if (snakesAndLadders[squareNum] > squareNum) {
      baseStyle += "bg-green-500 text-white "; // Ladder
    } else if (snakesAndLadders[squareNum] < squareNum) {
      baseStyle += "bg-red-500 text-white "; // Snake
    } else {
      baseStyle += squareNum % 2 === 0 ? "bg-green-400 text-black " : "bg-green-300 text-black ";
    }
    
    return baseStyle;
  };

  // SVG Snake and Ladder overlays
  const renderSnakesAndLadders = () => {
    const elements = [];
    
    Object.entries(snakesAndLadders).forEach(([start, end]) => {
      const isLadder = end > start;
      const startRow = Math.floor((100 - start) / 10);
      const startCol = startRow % 2 === 0 ? (start - 1) % 10 : 9 - ((start - 1) % 10);
      const endRow = Math.floor((100 - end) / 10);
      const endCol = endRow % 2 === 0 ? (end - 1) % 10 : 9 - ((end - 1) % 10);
      
      const startX = startCol * 40 + 20;
      const startY = startRow * 40 + 20;
      const endX = endCol * 40 + 20;
      const endY = endRow * 40 + 20;
      
      if (isLadder) {
        // Draw ladder
        elements.push(
          <g key={`ladder-${start}`}>
            <line 
              x1={startX - 5} y1={startY} x2={endX - 5} y2={endY} 
              stroke="#8B4513" strokeWidth="3"
            />
            <line 
              x1={startX + 5} y1={startY} x2={endX + 5} y2={endY} 
              stroke="#8B4513" strokeWidth="3"
            />
            {/* Ladder rungs */}
            {Array.from({ length: 4 }).map((_, i) => {
              const t = (i + 1) / 5;
              const rungY = startY + t * (endY - startY);
              return (
                <line
                  key={i}
                  x1={startX - 5} y1={rungY}
                  x2={startX + 5} y2={rungY}
                  stroke="#8B4513" strokeWidth="2"
                />
              );
            })}
          </g>
        );
      } else {
        // Draw snake
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        elements.push(
          <g key={`snake-${start}`}>
            <path
              d={`M ${startX} ${startY} Q ${midX} ${midY - 30} ${endX} ${endY}`}
              stroke="#FF0000" strokeWidth="4" fill="none"
            />
            <circle cx={startX} cy={startY} r="3" fill="#FF0000" />
            <circle cx={endX} cy={endY} r="6" fill="#FF0000" />
          </g>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </button>
          
          <h1 className="text-white text-2xl font-bold">Snake & Ladder vs Bot</h1>
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Info */}
          <div className="space-y-6">
            {/* Players Status */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Players</h2>
              
              <div className="space-y-3">
                <div className={`bg-blue-700 rounded-lg p-3 border-2 ${
                  currentPlayer === 'player' ? 'border-lime-400' : 'border-transparent'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-white">You �</span>
                    <span className="text-lime-400 font-bold">{playerPosition}</span>
                  </div>
                </div>
                <div className={`bg-blue-700 rounded-lg p-3 border-2 ${
                  currentPlayer === 'bot' ? 'border-red-400' : 'border-transparent'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Bot �</span>
                    <span className="text-red-400 font-bold">{botPosition}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dice */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Dice</h2>
              
              <div className="text-center">
                <motion.div
                  animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                  className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  {diceValue || '?'}
                </motion.div>
                
                <button
                  onClick={rollDice}
                  disabled={isRolling || gameOver || currentPlayer !== 'player'}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors w-full justify-center
                    ${currentPlayer === 'player' && !gameOver && !isRolling
                      ? 'bg-lime-500 hover:bg-lime-600 text-black cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <Dice6 className="w-5 h-5" />
                  <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Legend</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-white">Ladder (Go Up)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-white">Snake (Go Down)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-white">Finish (100)</span>
                </div>
              </div>
            </div>

            {gameOver && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6">
                <div className="flex items-center space-x-2 text-white">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-lg">Game Over!</div>
                    <div>{winner}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="lg:col-span-3">
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="mb-4">
                <div className="text-white text-lg font-semibold mb-2">
                  {gameOver ? 'Game Over!' : 
                   currentPlayer === 'player' ? 'Your Turn - Roll the dice!' : 'Bot is playing...'}
                </div>
                <div className="text-blue-300 text-sm">
                  Race to reach square 100 first! Watch out for snakes and use ladders to climb faster.
                </div>
              </div>
              
              {/* Board with Snake and Ladder Graphics */}
              <div className="relative bg-green-200 p-4 rounded-xl max-w-2xl mx-auto border-4 border-green-600">
                {/* SVG Overlay for Snakes and Ladders */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                  viewBox="0 0 400 400"
                  style={{ top: '16px', left: '16px', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }}
                >
                  {renderSnakesAndLadders()}
                </svg>

                {/* Game Grid */}
                <div className="relative grid grid-cols-10 gap-1 z-20">
                  {board.map((row, rowIndex) => 
                    row.map((squareNum, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`${getSquareStyle(squareNum)} w-10 h-10`}
                      >
                        <span className="text-xs font-bold z-30 relative">{squareNum === 0 ? 'START' : squareNum}</span>
                        
                        {/* Player tokens */}
                        <div className="absolute inset-0 flex items-center justify-center z-40">
                          {playerPosition === squareNum && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white absolute top-0 left-0 z-50"
                            />
                          )}
                          {botPosition === squareNum && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 bg-red-600 rounded-full border-2 border-white absolute bottom-0 right-0 z-50"
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Log */}
        <div className="mt-6 bg-blue-800 rounded-xl p-6">
          <h2 className="text-white text-xl font-bold mb-4">Game Log</h2>
          <div className="bg-blue-900 rounded-lg p-4 max-h-32 overflow-y-auto">
            {gameLog.length === 0 ? (
              <div className="text-blue-300 text-sm">Game log will appear here...</div>
            ) : (
              <div className="space-y-1">
                {gameLog.slice(-5).map((log, index) => (
                  <div key={index} className="text-blue-200 text-sm">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeAndLadderGame;