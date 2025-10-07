import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProperLudoGame = ({ onBackToHome }) => {
  // Game state
  const [gameState, setGameState] = useState({
    currentPlayer: 0, // 0: Red, 1: Green, 2: Blue, 3: Yellow
    diceValue: 1,
    isDiceRolled: false,
    playerPositions: {
      0: [-1, -1, -1, -1], // Red pieces (home = -1, board positions 0-51)
      1: [-1, -1, -1, -1], // Green pieces  
      2: [-1, -1, -1, -1], // Blue pieces
      3: [-1, -1, -1, -1]  // Yellow pieces
    },
    selectedPiece: null,
    gameStarted: false,
    winner: null
  });

  const colors = ['#EF4444', '#22C55E', '#3B82F6', '#EAB308']; // Red, Green, Blue, Yellow
  const playerNames = ['Red', 'Green', 'Blue', 'Yellow'];

  // Define the board path (52 positions around the board)
  const boardPath = [
    // Starting from Red's entry point, going clockwise
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],           // Red to Green side
    [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],   // Green entrance area
    [0, 7], [0, 8],                                     // Top-left corner
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],           // Green to Blue side
    [6, 9], [6, 10], [6, 11], [6, 12], [6, 13],       // Blue entrance area
    [7, 13], [8, 13],                                   // Top-right corner
    [8, 12], [8, 11], [8, 10], [8, 9], [8, 8],        // Blue to Yellow side
    [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], // Yellow entrance area
    [14, 7], [14, 6],                                   // Bottom-right corner
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],       // Yellow to Red side
    [8, 5], [8, 4], [8, 3], [8, 2], [8, 1],           // Red entrance area
    [7, 1], [6, 1]                                      // Back to start (position 0)
  ];

  // Home entrance paths for each player
  const homeEntrancePaths = {
    0: [[7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]], // Red home path
    1: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]], // Green home path  
    2: [[7, 12], [7, 11], [7, 10], [7, 9], [7, 8], [7, 7]], // Blue home path
    3: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]  // Yellow home path
  };

  // Starting positions for each player
  const startingPositions = { 0: 0, 1: 13, 2: 26, 3: 39 };

  // Safe zones where pieces can't be captured
  const safeZones = [0, 8, 13, 21, 26, 34, 39, 47];

  const rollDice = () => {
    if (gameState.isDiceRolled) return;

    const newValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: newValue,
      isDiceRolled: true,
      gameStarted: true
    }));

    // Check if player has valid moves
    setTimeout(() => {
      checkValidMoves(newValue);
    }, 500);
  };

  const checkValidMoves = (diceValue) => {
    const currentPlayer = gameState.currentPlayer;
    const positions = gameState.playerPositions[currentPlayer];
    
    let hasValidMove = false;
    
    for (let i = 0; i < 4; i++) {
      if (canMovePiece(currentPlayer, i, diceValue)) {
        hasValidMove = true;
        break;
      }
    }

    if (!hasValidMove) {
      // No valid moves, switch to next player
      setTimeout(() => {
        switchPlayer();
      }, 1000);
    }
  };

  const canMovePiece = (player, pieceIndex, diceValue) => {
    const position = gameState.playerPositions[player][pieceIndex];
    
    // Piece in home - can only move with 6
    if (position === -1) {
      return diceValue === 6;
    }
    
    // Piece finished
    if (position >= 57) {
      return false;
    }
    
    // Check if move is within bounds
    const newPosition = position + diceValue;
    if (newPosition > 57) {
      return false;
    }
    
    return true;
  };

  const movePiece = (pieceIndex) => {
    if (!gameState.isDiceRolled) return;
    
    const currentPlayer = gameState.currentPlayer;
    if (!canMovePiece(currentPlayer, pieceIndex, gameState.diceValue)) return;

    const currentPosition = gameState.playerPositions[currentPlayer][pieceIndex];
    let newPosition;

    if (currentPosition === -1) {
      // Move from home to starting position
      newPosition = startingPositions[currentPlayer];
    } else {
      newPosition = currentPosition + gameState.diceValue;
    }

    // Animate piece movement
    animatePieceMovement(currentPlayer, pieceIndex, currentPosition, newPosition);
  };

  const animatePieceMovement = (player, pieceIndex, fromPosition, toPosition) => {
    // Update position immediately for smooth animation
    setGameState(prev => {
      const newPositions = { ...prev.playerPositions };
      newPositions[player] = [...newPositions[player]];
      newPositions[player][pieceIndex] = toPosition;
      
      return {
        ...prev,
        playerPositions: newPositions,
        selectedPiece: null
      };
    });

    // Check for captures
    setTimeout(() => {
      checkForCapture(player, toPosition);
      
      // Check win condition
      if (checkWinCondition(player)) {
        setGameState(prev => ({ ...prev, winner: player }));
        return;
      }

      // Continue turn if rolled 6 or captured, otherwise switch player
      if (gameState.diceValue !== 6) {
        setTimeout(() => switchPlayer(), 500);
      } else {
        setGameState(prev => ({ ...prev, isDiceRolled: false }));
      }
    }, 300);
  };

  const checkForCapture = (player, position) => {
    if (safeZones.includes(position) || position >= 52) return;

    // Check if any opponent pieces are on this position
    for (let otherPlayer = 0; otherPlayer < 4; otherPlayer++) {
      if (otherPlayer === player) continue;
      
      const otherPositions = gameState.playerPositions[otherPlayer];
      for (let i = 0; i < 4; i++) {
        if (otherPositions[i] === position) {
          // Capture the piece
          setGameState(prev => {
            const newPositions = { ...prev.playerPositions };
            newPositions[otherPlayer] = [...newPositions[otherPlayer]];
            newPositions[otherPlayer][i] = -1; // Send back home
            return { ...prev, playerPositions: newPositions };
          });
        }
      }
    }
  };

  const checkWinCondition = (player) => {
    return gameState.playerPositions[player].every(pos => pos >= 57);
  };

  const switchPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 4,
      isDiceRolled: false,
      selectedPiece: null
    }));
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 0,
      diceValue: 1,
      isDiceRolled: false,
      playerPositions: {
        0: [-1, -1, -1, -1],
        1: [-1, -1, -1, -1],
        2: [-1, -1, -1, -1],
        3: [-1, -1, -1, -1]
      },
      selectedPiece: null,
      gameStarted: false,
      winner: null
    });
  };

  const getPiecePosition = (player, pieceIndex) => {
    const position = gameState.playerPositions[player][pieceIndex];
    
    if (position === -1) {
      // Home position
      const homePositions = {
        0: [[2, 2], [4, 2], [2, 4], [4, 4]], // Red home
        1: [[10, 2], [12, 2], [10, 4], [12, 4]], // Green home
        2: [[2, 10], [4, 10], [2, 12], [4, 12]], // Blue home  
        3: [[10, 10], [12, 10], [10, 12], [12, 12]] // Yellow home
      };
      return homePositions[player][pieceIndex];
    }
    
    if (position >= 52 && position < 57) {
      // Home entrance path
      const homeIndex = position - 52;
      return homeEntrancePaths[player][homeIndex];
    }
    
    if (position >= 57) {
      // Finished - center position
      return [7, 7];
    }
    
    // Regular board position
    return boardPath[position % 52];
  };

  const PieceComponent = ({ player, pieceIndex }) => {
    const [row, col] = getPiecePosition(player, pieceIndex);
    const isMovable = canMovePiece(player, pieceIndex, gameState.diceValue) && 
                     gameState.currentPlayer === player && 
                     gameState.isDiceRolled;

    return (
      <motion.div
        className={`absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer z-10 ${
          isMovable ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
        }`}
        style={{
          backgroundColor: colors[player],
          left: `${col * 6.67}%`,
          top: `${row * 6.67}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => isMovable && movePiece(pieceIndex)}
        animate={{
          scale: isMovable ? [1, 1.2, 1] : 1,
          left: `${col * 6.67}%`,
          top: `${row * 6.67}%`
        }}
        transition={{
          scale: { repeat: isMovable ? Infinity : 0, duration: 1 },
          left: { duration: 0.5 },
          top: { duration: 0.5 }
        }}
        whileHover={isMovable ? { scale: 1.3 } : {}}
      >
        {/* SVG coin design */}
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="10" fill={colors[player]} stroke="white" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" fill="white" fillOpacity="0.3"/>
          <text x="12" y="16" textAnchor="middle" className="text-xs font-bold fill-white">
            {pieceIndex + 1}
          </text>
        </svg>
      </motion.div>
    );
  };

  const DiceComponent = () => (
    <motion.button
      onClick={rollDice}
      disabled={gameState.isDiceRolled}
      className={`relative w-16 h-16 bg-white border-4 border-gray-800 rounded-lg shadow-lg ${
        gameState.isDiceRolled ? 'opacity-50' : 'hover:scale-105'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-2 bg-gradient-to-br from-gray-100 to-gray-300 rounded">
        <DiceFace value={gameState.diceValue} />
      </div>
    </motion.button>
  );

  const DiceFace = ({ value }) => {
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
    };

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {dotPositions[value]?.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="8" fill="#1f2937" />
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      {/* Back Button */}
      <motion.button
        onClick={onBackToHome}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Games
      </motion.button>

      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Ludo Game</h1>
        
        {/* Game Controls */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-lg font-semibold">
            Current Player: 
            <span 
              className="ml-2 px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: colors[gameState.currentPlayer] }}
            >
              {playerNames[gameState.currentPlayer]}
            </span>
          </div>
          
          <DiceComponent />
          
          <motion.button
            onClick={resetGame}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Game
          </motion.button>
        </div>

        {/* Game Board */}
        <div className="relative w-96 h-96 bg-white border-4 border-gray-800 rounded-lg shadow-2xl">
          <img 
            src="/ludo-bg.jpg" 
            alt="Ludo Board" 
            className="w-full h-full object-cover rounded"
          />
          
          {/* Render all pieces */}
          {[0, 1, 2, 3].map(player => 
            [0, 1, 2, 3].map(piece => (
              <PieceComponent key={`${player}-${piece}`} player={player} pieceIndex={piece} />
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-600 max-w-md">
          <p className="mb-2">Roll the dice to move your pieces!</p>
          <p className="text-sm">• Roll 6 to get a piece out of home</p>
          <p className="text-sm">• Rolling 6 gives you another turn</p>
          <p className="text-sm">• Capture opponent pieces to send them home</p>
          <p className="text-sm">• Get all 4 pieces to the center to win!</p>
        </div>

        {/* Winner Modal */}
        <AnimatePresence>
          {gameState.winner !== null && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
                <p className="text-xl mb-6">
                  <span style={{ color: colors[gameState.winner] }}>
                    {playerNames[gameState.winner]}
                  </span> wins!
                </p>
                <motion.button
                  onClick={resetGame}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProperLudoGame;