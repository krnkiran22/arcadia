import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TraditionalLudoGame = () => {
  const [gameState, setGameState] = useState({
    players: {
      red: { pieces: [0, 0, 0, 0], home: true },
      green: { pieces: [0, 0, 0, 0], home: true },
      blue: { pieces: [0, 0, 0, 0], home: true },
      yellow: { pieces: [0, 0, 0, 0], home: true }
    },
    currentPlayer: 'red',
    diceValue: 1,
    gameStarted: false
  });

  const colors = {
    red: '#EF4444',
    green: '#22C55E', 
    blue: '#3B82F6',
    yellow: '#EAB308'
  };

  // Traditional Ludo board positions - 15x15 grid
  const createBoard = () => {
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // Mark safe zones with stars
    const safeZones = [
      [6, 1], [1, 6], [8, 6], [6, 8], [13, 8], [8, 13], [6, 13], [13, 6]
    ];
    
    safeZones.forEach(([row, col]) => {
      if (board[row] && board[row][col] !== undefined) {
        board[row][col] = 'safe';
      }
    });

    return board;
  };

  const [board, setBoard] = useState(createBoard());

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: newValue,
      gameStarted: true
    }));
  };

  const renderHomeArea = (color, position) => {
    const pieces = gameState.players[color].pieces;
    
    return (
      <div className={`home-area ${position} relative`}>
        <div 
          className="w-full h-full border-4 border-gray-800 flex flex-wrap items-center justify-center"
          style={{ backgroundColor: colors[color] }}
        >
          {/* Four circles representing piece positions */}
          <div className="grid grid-cols-2 gap-2 p-2">
            {[0, 1, 2, 3].map(pieceIndex => (
              <motion.div
                key={`${color}-${pieceIndex}`}
                className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-lg flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: colors[color] }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBoardCell = (row, col) => {
    const isPath = (
      // Horizontal paths
      (row === 6 && col >= 0 && col <= 14) ||
      (row === 8 && col >= 0 && col <= 14) ||
      // Vertical paths  
      (col === 6 && row >= 0 && row <= 14) ||
      (col === 8 && row >= 0 && row <= 14)
    );

    const isHomeColumn = (
      (col === 7 && row >= 1 && row <= 5) ||  // Red home column
      (col === 7 && row >= 9 && row <= 13) || // Blue home column
      (row === 7 && col >= 1 && col <= 5) ||  // Green home column
      (row === 7 && col >= 9 && col <= 13)    // Yellow home column
    );

    const isSafeZone = board[row][col] === 'safe';
    const isCenter = (row === 7 && col === 7);

    let cellColor = '#F3F4F6'; // Default light gray
    
    if (isCenter) {
      cellColor = '#10B981'; // Center triangle area
    } else if (isHomeColumn) {
      if (col === 7 && row >= 1 && row <= 5) cellColor = colors.red;
      else if (col === 7 && row >= 9 && row <= 13) cellColor = colors.blue;
      else if (row === 7 && col >= 1 && col <= 5) cellColor = colors.green;
      else if (row === 7 && col >= 9 && col <= 13) cellColor = colors.yellow;
    } else if (isPath) {
      cellColor = '#E5E7EB'; // Light gray for paths
    }

    return (
      <div
        key={`${row}-${col}`}
        className="board-cell border border-gray-400 relative flex items-center justify-center"
        style={{ 
          backgroundColor: cellColor,
          width: '100%',
          height: '100%',
          minHeight: '25px'
        }}
      >
        {isSafeZone && (
          <div className="text-gray-600 text-xs">★</div>
        )}
        {isCenter && (
          <div className="triangle-center text-white text-xs font-bold">
            <div className="text-center">
              <div>🏠</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <motion.div 
        className="game-container bg-white rounded-2xl shadow-2xl p-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Traditional Ludo</h2>
        
        {/* Game Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            Current Player: 
            <span 
              className="ml-2 px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: colors[gameState.currentPlayer] }}
            >
              {gameState.currentPlayer.toUpperCase()}
            </span>
          </div>
          
          <motion.button
            onClick={rollDice}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Roll Dice: {gameState.diceValue}
          </motion.button>
        </div>

        {/* Ludo Board */}
        <div className="ludo-board relative bg-white border-4 border-gray-800 mx-auto" style={{ width: '500px', height: '500px' }}>
          {/* Top Section */}
          <div className="absolute top-0 left-0 right-0 h-1/3 flex">
            {/* Red Home Area */}
            <div className="w-2/5 h-full">
              {renderHomeArea('red', 'top-left')}
            </div>
            
            {/* Top Path */}
            <div className="w-1/5 h-full grid grid-rows-6">
              {[0, 1, 2, 3, 4, 5].map(row => (
                <div key={row} className="grid grid-cols-3">
                  {[6, 7, 8].map(col => renderBoardCell(row, col))}
                </div>
              ))}
            </div>
            
            {/* Green Home Area */}
            <div className="w-2/5 h-full">
              {renderHomeArea('green', 'top-right')}
            </div>
          </div>

          {/* Middle Section */}
          <div className="absolute top-1/3 left-0 right-0 h-1/3 flex">
            {/* Left Path */}
            <div className="w-2/5 h-full grid grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map(col => (
                <div key={col} className="grid grid-rows-3">
                  {[6, 7, 8].map(row => renderBoardCell(row, col))}
                </div>
              ))}
            </div>
            
            {/* Center Area */}
            <div className="w-1/5 h-full grid grid-rows-3">
              {[6, 7, 8].map(row => (
                <div key={row} className="grid grid-cols-3">
                  {[6, 7, 8].map(col => renderBoardCell(row, col))}
                </div>
              ))}
            </div>
            
            {/* Right Path */}
            <div className="w-2/5 h-full grid grid-cols-6">
              {[9, 10, 11, 12, 13, 14].map(col => (
                <div key={col} className="grid grid-rows-3">
                  {[6, 7, 8].map(row => renderBoardCell(row, col))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 flex">
            {/* Blue Home Area */}
            <div className="w-2/5 h-full">
              {renderHomeArea('blue', 'bottom-left')}
            </div>
            
            {/* Bottom Path */}
            <div className="w-1/5 h-full grid grid-rows-6">
              {[9, 10, 11, 12, 13, 14].map(row => (
                <div key={row} className="grid grid-cols-3">
                  {[6, 7, 8].map(col => renderBoardCell(row, col))}
                </div>
              ))}
            </div>
            
            {/* Yellow Home Area */}
            <div className="w-2/5 h-full">
              {renderHomeArea('yellow', 'bottom-right')}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-6 text-center text-gray-600">
          <p>Click "Roll Dice" to start playing!</p>
          <p className="text-sm mt-2">★ marks safe zones where pieces cannot be captured</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TraditionalLudoGame;