import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChessStyleLudoGame = ({ onBackToHome }) => {
  // Game state
  const [gameState, setGameState] = useState({
    currentPlayer: 0, // 0: Red, 1: Blue
    diceValue: null,
    canRollDice: true,
    gameStarted: false,
    winner: null
  });

  // Player colors and names (4-player game)
  const players = [
    { name: 'Red', color: '#EF4444', id: 'red' },
    { name: 'Blue', color: '#3B82F6', id: 'blue' },
    { name: 'Yellow', color: '#EAB308', id: 'yellow' },
    { name: 'Green', color: '#22C55E', id: 'green' }
  ];

  // Initialize piece positions - all pieces start in their home areas (4-player game)
  const initializePieces = () => {
    return {
      red: [0, 1, 2, 3].map(i => ({ id: i, position: -1, isInHome: true, isFinished: false })),
      blue: [0, 1, 2, 3].map(i => ({ id: i, position: -1, isInHome: true, isFinished: false })),
      yellow: [0, 1, 2, 3].map(i => ({ id: i, position: -1, isInHome: true, isFinished: false })),
      green: [0, 1, 2, 3].map(i => ({ id: i, position: -1, isInHome: true, isFinished: false }))
    };
  };

  const [pieces, setPieces] = useState(initializePieces());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [eligiblePieces, setEligiblePieces] = useState([]);

  // Board coordinates mapping (scaled for 500x500 board)
  // These coordinates correspond to the actual tiles on the board
  const boardCoordinates = {
    // Red player's starting path (bottom row)
    0: { x: 33, y: 450 }, 1: { x: 67, y: 450 }, 2: { x: 100, y: 450 }, 3: { x: 133, y: 450 }, 4: { x: 167, y: 450 }, 5: { x: 200, y: 450 },
    // Left side going up
    6: { x: 200, y: 417 }, 7: { x: 200, y: 383 }, 8: { x: 200, y: 350 }, 9: { x: 200, y: 317 }, 10: { x: 200, y: 283 }, 11: { x: 200, y: 250 },
    // Top path (Green player's area)
    12: { x: 200, y: 217 }, 13: { x: 233, y: 217 }, 14: { x: 267, y: 217 }, 15: { x: 300, y: 217 }, 16: { x: 333, y: 217 }, 17: { x: 367, y: 217 }, 18: { x: 400, y: 217 },
    // Right side going down
    19: { x: 400, y: 250 }, 20: { x: 400, y: 283 }, 21: { x: 400, y: 317 }, 22: { x: 400, y: 350 }, 23: { x: 400, y: 383 }, 24: { x: 400, y: 417 },
    // Blue player's starting path (right bottom)
    25: { x: 400, y: 450 }, 26: { x: 433, y: 450 }, 27: { x: 467, y: 450 }, 28: { x: 467, y: 417 }, 29: { x: 467, y: 383 }, 30: { x: 467, y: 350 },
    // Continue around the board - completing the square
    31: { x: 467, y: 317 }, 32: { x: 467, y: 283 }, 33: { x: 467, y: 250 }, 34: { x: 467, y: 217 }, 35: { x: 467, y: 183 }, 36: { x: 467, y: 150 },
    37: { x: 433, y: 150 }, 38: { x: 400, y: 150 }, 39: { x: 367, y: 150 }, 40: { x: 333, y: 150 }, 41: { x: 300, y: 150 }, 42: { x: 267, y: 150 },
    43: { x: 233, y: 150 }, 44: { x: 200, y: 150 }, 45: { x: 167, y: 150 }, 46: { x: 133, y: 150 }, 47: { x: 100, y: 150 }, 48: { x: 67, y: 150 },
    49: { x: 33, y: 150 }, 50: { x: 33, y: 183 }, 51: { x: 33, y: 217 }
  };

  // Starting positions for each player (4-player game)
  const startPositions = { red: 25, blue: 12, yellow: 38, green: 51 };
  
  // Safe positions (star positions)
  const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];

  // Home area coordinates for pieces (scaled for 500x500 board)
  // Fixed positioning: red = bottom-left, blue = bottom-right
  const homeCoordinates = {
    red: [
      { x: 380, y: 380 }, { x: 420, y: 380 },
      { x: 380, y: 420 }, { x: 420, y: 420 }
    ],
    blue: [
      { x: 80, y: 380 }, { x: 120, y: 380 },
      { x: 80, y: 420 }, { x: 120, y: 420 }
    ],
    yellow: [
      { x: 80, y: 80 }, { x: 120, y: 80 },
      { x: 80, y: 120 }, { x: 120, y: 120 }
    ],
    green: [
      { x: 380, y: 80 }, { x: 420, y: 80 },
      { x: 380, y: 120 }, { x: 420, y: 120 }
    ]
  };

  // Roll dice function
  const rollDice = useCallback(() => {
    if (!gameState.canRollDice) return;
    
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: newDiceValue,
      canRollDice: false,
      gameStarted: true
    }));

    // Find eligible pieces to move
    setTimeout(() => {
      findEligiblePieces(newDiceValue);
    }, 500);
  }, [gameState.canRollDice]);

  // Find which pieces can move
  const findEligiblePieces = (diceValue) => {
    const currentPlayerKey = players[gameState.currentPlayer].id;
    const playerPieces = pieces[currentPlayerKey];
    
    const eligible = playerPieces.filter(piece => {
      // If piece is in home, can only move with 6
      if (piece.isInHome) {
        return diceValue === 6;
      }
      
      // If piece is finished, can't move
      if (piece.isFinished) {
        return false;
      }
      
      // Check if move would go beyond finish line
      const newPosition = (piece.position + diceValue) % 52;
      return true; // Simplified for now
    });

    setEligiblePieces(eligible.map(p => p.id));
    
    if (eligible.length === 0) {
      // No moves possible, next player's turn
      setTimeout(() => {
        nextTurn();
      }, 1000);
    }
  };

  // Handle piece selection
  const selectPiece = (pieceId) => {
    if (!eligiblePieces.includes(pieceId)) return;
    
    setSelectedPiece(pieceId);
    movePiece(pieceId);
  };

  // Move piece
  const movePiece = (pieceId) => {
    const currentPlayerKey = players[gameState.currentPlayer].id;
    
    setPieces(prev => ({
      ...prev,
      [currentPlayerKey]: prev[currentPlayerKey].map(piece => {
        if (piece.id === pieceId) {
          if (piece.isInHome && gameState.diceValue === 6) {
            // Move piece out of home to start position
            return {
              ...piece,
              isInHome: false,
              position: startPositions[currentPlayerKey]
            };
          } else if (!piece.isInHome) {
            // Move piece on board
            const newPosition = (piece.position + gameState.diceValue) % 52;
            return {
              ...piece,
              position: newPosition
            };
          }
        }
        return piece;
      })
    }));

    // Check for next turn
    setTimeout(() => {
      if (gameState.diceValue !== 6) {
        nextTurn();
      } else {
        // Player gets another turn for rolling 6
        setGameState(prev => ({ ...prev, canRollDice: true }));
      }
      setSelectedPiece(null);
      setEligiblePieces([]);
    }, 1000);
  };

  // Next player's turn (4-player game)
  const nextTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 4,
      canRollDice: true,
      diceValue: null
    }));
  };

  // Reset game
  const resetGame = () => {
    setPieces(initializePieces());
    setGameState({
      currentPlayer: 0,
      diceValue: null,
      canRollDice: true,
      gameStarted: false,
      winner: null
    });
    setSelectedPiece(null);
    setEligiblePieces([]);
  };

  // Render piece component
  const renderPiece = (piece, playerKey, index) => {
    const player = players.find(p => p.id === playerKey);
    const isEligible = eligiblePieces.includes(piece.id);
    const isSelected = selectedPiece === piece.id;

    return (
      <motion.div
        key={`${playerKey}-${piece.id}`}
        className={`
          w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer
          flex items-center justify-center relative
          ${isEligible ? 'ring-4 ring-white ring-opacity-70 animate-pulse' : ''}
          ${isSelected ? 'scale-110' : ''}
        `}
        style={{ backgroundColor: player.color }}
        onClick={() => selectPiece(piece.id)}
        whileHover={{ scale: isEligible ? 1.1 : 1 }}
        whileTap={{ scale: 0.9 }}
        animate={isEligible ? { 
          boxShadow: ['0 0 0 0 rgba(255,255,255,0.7)', '0 0 0 10px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0.7)']
        } : {}}
        transition={{ duration: 1, repeat: isEligible ? Infinity : 0 }}
      >
        <div className="w-6 h-6 rounded-full bg-white bg-opacity-30" />
      </motion.div>
    );
  };

  // Render pieces in their home areas with correct positioning
  const renderHomePieces = (playerKey) => {
    const playerPieces = pieces[playerKey];
    const homePieces = playerPieces.filter(p => p.isInHome);
    const homeCoords = homeCoordinates[playerKey];

    return homePieces.map((piece, index) => {
      const coords = homeCoords[index] || homeCoords[0]; // Fallback to first position
      
      return (
        <div
          key={`home-${playerKey}-${piece.id}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: coords.x, top: coords.y }}
        >
          {renderPiece(piece, playerKey, piece.id)}
        </div>
      );
    });
  };

  const currentPlayer = players[gameState.currentPlayer];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-blue-800/50 backdrop-blur-sm">
        <motion.button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Games
        </motion.button>
        
        <h1 className="text-3xl font-bold">Ludo Game</h1>
        
        <motion.button
          onClick={resetGame}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      </div>

      <div className="flex gap-6 p-6">
        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: '500px', height: '500px' }}>
            {/* Board Background */}
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: 'url(/ludo-bg.jpg)' }}
            >
              {/* Home Area Pieces */}
              {Object.keys(pieces).map(playerKey => renderHomePieces(playerKey))}

              {/* Board Path - Pieces that are in play */}
              {Object.entries(pieces).map(([playerKey, playerPieces]) => 
                playerPieces
                  .filter(piece => !piece.isInHome && !piece.isFinished)
                  .map(piece => {
                    // Use actual board coordinates if available
                    const coords = boardCoordinates[piece.position];
                    if (!coords) return null;

                    return (
                      <div
                        key={`board-${playerKey}-${piece.id}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: coords.x, top: coords.y }}
                      >
                        {renderPiece(piece, playerKey, piece.id)}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Game Status Panel */}
        <div className="w-64 space-y-4">
          {/* Current Turn */}
          <motion.div 
            className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center">Game Status</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-blue-300 mb-2">Current Turn</p>
                <div 
                  className="px-4 py-2 rounded-lg text-white font-semibold text-center"
                  style={{ backgroundColor: currentPlayer.color }}
                >
                  {currentPlayer.name} Player
                </div>
              </div>

              <div>
                <p className="text-blue-300 mb-2">Game Mode</p>
                <div className="px-4 py-2 bg-blue-700 rounded-lg text-center">
                  4 Player Ludo
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dice Section */}
          <motion.div 
            className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center">Dice</h3>
            
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-4xl font-bold text-gray-800 border-4 border-gray-300"
                animate={gameState.diceValue ? { rotateX: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                {gameState.diceValue || '?'}
              </motion.div>
              
              <motion.button
                onClick={rollDice}
                disabled={!gameState.canRollDice}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  gameState.canRollDice 
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={gameState.canRollDice ? { scale: 1.05 } : {}}
                whileTap={gameState.canRollDice ? { scale: 0.95 } : {}}
              >
                {gameState.canRollDice ? 'Roll Dice' : 'Wait...'}
              </motion.button>
            </div>
          </motion.div>


        </div>
      </div>
    </div>
  );
};

export default ChessStyleLudoGame;