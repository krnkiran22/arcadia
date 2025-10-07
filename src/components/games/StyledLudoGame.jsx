import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Home, Trophy, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const StyledLudoGame = ({ onBackToHome }) => {
  // Player colors and names
  const players = ['Red', 'Green', 'Blue', 'Yellow'];
  const playerColors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
  
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
    highlightedPieces: [],
    gameStarted: false,
    winner: null,
    isAnimating: false
  });

  // Starting positions for each player (corrected)
  const startPositions = [0, 13, 26, 39]; // Red, Green, Blue, Yellow
  const homeStretch = {
    0: [50, 49, 48, 47, 46, 45], // Red home path
    1: [11, 10, 9, 8, 7, 6],     // Green home path  
    2: [24, 23, 22, 21, 20, 19], // Blue home path
    3: [37, 36, 35, 34, 33, 32]  // Yellow home path
  };

  // Safe positions where pieces can't be captured
  const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];

  // Board coordinates for positioning pieces (corrected for proper Ludo board layout)
  const boardCoordinates = {
    // Red player path (starting from bottom-left, going right)
    0: { x: 7, y: 87 }, 1: { x: 13, y: 87 }, 2: { x: 20, y: 87 }, 3: { x: 27, y: 87 }, 4: { x: 33, y: 87 }, 5: { x: 40, y: 87 },
    // Going up the left side
    6: { x: 40, y: 80 }, 7: { x: 40, y: 73 }, 8: { x: 40, y: 67 }, 9: { x: 40, y: 60 }, 10: { x: 40, y: 53 }, 11: { x: 40, y: 47 },
    // Entering top area (Green zone)
    12: { x: 40, y: 40 }, 13: { x: 47, y: 40 }, 14: { x: 53, y: 40 }, 15: { x: 60, y: 40 }, 16: { x: 67, y: 40 }, 17: { x: 73, y: 40 }, 18: { x: 80, y: 40 },
    // Going up to top
    19: { x: 80, y: 33 }, 20: { x: 80, y: 27 }, 21: { x: 80, y: 20 }, 22: { x: 80, y: 13 }, 23: { x: 80, y: 7 }, 24: { x: 80, y: 0 },
    // Top row (going right)
    25: { x: 87, y: 0 }, 26: { x: 93, y: 0 }, 27: { x: 93, y: 7 }, 28: { x: 93, y: 13 }, 29: { x: 93, y: 20 }, 30: { x: 93, y: 27 },
    // Going down right side
    31: { x: 93, y: 33 }, 32: { x: 93, y: 40 }, 33: { x: 93, y: 47 }, 34: { x: 93, y: 53 }, 35: { x: 93, y: 60 }, 36: { x: 93, y: 67 },
    // Bottom right area
    37: { x: 93, y: 73 }, 38: { x: 93, y: 80 }, 39: { x: 87, y: 87 }, 40: { x: 80, y: 87 }, 41: { x: 73, y: 87 }, 42: { x: 67, y: 87 },
    // Going left on bottom
    43: { x: 60, y: 87 }, 44: { x: 53, y: 87 }, 45: { x: 47, y: 87 }, 46: { x: 47, y: 80 }, 47: { x: 47, y: 73 }, 48: { x: 47, y: 67 },
    // Back to start area
    49: { x: 47, y: 60 }, 50: { x: 47, y: 53 }, 51: { x: 47, y: 47 }
  };

  // Home positions for pieces not on board (corrected positioning)
  const homePositions = {
    0: [{ x: 17, y: 67 }, { x: 27, y: 67 }, { x: 17, y: 77 }, { x: 27, y: 77 }], // Red (bottom-left)
    1: [{ x: 17, y: 17 }, { x: 27, y: 17 }, { x: 17, y: 27 }, { x: 27, y: 27 }], // Green (top-left)
    2: [{ x: 67, y: 67 }, { x: 77, y: 67 }, { x: 67, y: 77 }, { x: 77, y: 77 }], // Blue (bottom-right)
    3: [{ x: 67, y: 17 }, { x: 77, y: 17 }, { x: 67, y: 27 }, { x: 77, y: 27 }]  // Yellow (top-right)
  };

  const getDiceIcon = (value) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1] || Dice1;
    return <Icon className="w-8 h-8" />;
  };

  const rollDice = useCallback(() => {
    if (gameState.isAnimating || gameState.isDiceRolled) return;

    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prev => ({
      ...prev,
      diceValue: newDiceValue,
      isDiceRolled: true,
      gameStarted: true
    }));

    // Check for eligible pieces after a short delay
    setTimeout(() => {
      checkEligiblePieces(newDiceValue);
    }, 500);
  }, [gameState.isAnimating, gameState.isDiceRolled]);

  const checkEligiblePieces = (diceValue) => {
    const currentPlayer = gameState.currentPlayer;
    const playerPieces = gameState.playerPositions[currentPlayer];
    const eligiblePieces = [];

    playerPieces.forEach((position, pieceIndex) => {
      // If piece is at home (-1) and dice is 6, it can come out
      if (position === -1 && diceValue === 6) {
        eligiblePieces.push(pieceIndex);
      }
      // If piece is on board and can move
      else if (position >= 0) {
        const newPosition = getNewPosition(currentPlayer, position, diceValue);
        if (newPosition !== null) {
          eligiblePieces.push(pieceIndex);
        }
      }
    });

    if (eligiblePieces.length > 0) {
      setGameState(prev => ({
        ...prev,
        highlightedPieces: eligiblePieces.map(index => ({ player: currentPlayer, piece: index }))
      }));
    } else {
      // No eligible pieces, next player's turn
      nextTurn();
    }
  };

  const getNewPosition = (player, currentPosition, steps) => {
    if (currentPosition === -1) {
      return steps === 6 ? startPositions[player] : null;
    }

    let newPosition = (currentPosition + steps) % 52;
    
    // Check if piece should enter home stretch
    const homeEntry = (startPositions[player] + 45) % 52;
    if (currentPosition <= homeEntry && newPosition > homeEntry) {
      // Enter home stretch
      const stepsIntoHome = newPosition - homeEntry - 1;
      if (stepsIntoHome < 6) {
        return 100 + player * 10 + stepsIntoHome; // Home stretch positions
      }
    }

    return newPosition;
  };

  const handlePieceClick = (player, pieceIndex) => {
    // Check if this piece is highlighted (eligible to move)
    const isHighlighted = gameState.highlightedPieces.some(
      hp => hp.player === player && hp.piece === pieceIndex
    );

    if (!isHighlighted || gameState.isAnimating) return;

    const currentPosition = gameState.playerPositions[player][pieceIndex];
    let newPosition;

    if (currentPosition === -1 && gameState.diceValue === 6) {
      // Move piece from home to start position
      newPosition = startPositions[player];
    } else if (currentPosition >= 0) {
      newPosition = getNewPosition(player, currentPosition, gameState.diceValue);
    }

    if (newPosition !== null) {
      movePiece(player, pieceIndex, newPosition);
    }
  };

  const movePiece = (player, pieceIndex, newPosition) => {
    setGameState(prev => ({
      ...prev,
      isAnimating: true,
      highlightedPieces: []
    }));

    // Animate piece movement
    setTimeout(() => {
      setGameState(prev => {
        const newPositions = { ...prev.playerPositions };
        newPositions[player] = [...newPositions[player]];
        newPositions[player][pieceIndex] = newPosition;

        // Check for captures
        checkForCaptures(player, newPosition, newPositions);

        const shouldContinue = prev.diceValue === 6 || checkForCaptures(player, newPosition, newPositions);

        return {
          ...prev,
          playerPositions: newPositions,
          isAnimating: false,
          isDiceRolled: shouldContinue ? false : true
        };
      });

      if (gameState.diceValue !== 6) {
        setTimeout(nextTurn, 500);
      } else {
        setGameState(prev => ({ ...prev, isDiceRolled: false }));
      }
    }, 300);
  };

  const checkForCaptures = (player, position, positions) => {
    if (safePositions.includes(position) || position >= 100) return false;

    let captured = false;
    Object.keys(positions).forEach(otherPlayer => {
      if (parseInt(otherPlayer) !== player) {
        positions[otherPlayer].forEach((otherPosition, pieceIndex) => {
          if (otherPosition === position) {
            positions[otherPlayer][pieceIndex] = -1; // Send back to home
            captured = true;
          }
        });
      }
    });

    return captured;
  };

  const nextTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 4,
      isDiceRolled: false,
      highlightedPieces: []
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
      highlightedPieces: [],
      gameStarted: false,
      winner: null,
      isAnimating: false
    });
  };

  const renderPiece = (player, pieceIndex) => {
    const position = gameState.playerPositions[player][pieceIndex];
    const isHighlighted = gameState.highlightedPieces.some(
      hp => hp.player === player && hp.piece === pieceIndex
    );

    let coordinates;
    if (position === -1) {
      coordinates = homePositions[player][pieceIndex];
    } else if (position >= 100) {
      // Home stretch position
      const homeIndex = position - 100 - player * 10;
      coordinates = boardCoordinates[homeStretch[player][homeIndex]];
    } else {
      coordinates = boardCoordinates[position];
    }

    return (
      <motion.div
        key={`${player}-${pieceIndex}`}
        className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer shadow-lg z-10 flex items-center justify-center
          ${isHighlighted ? 'animate-pulse border-white border-4' : 'border-gray-800'}
        `}
        style={{
          backgroundColor: playerColors[player],
          left: `${coordinates.x}%`,
          top: `${coordinates.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => handlePieceClick(player, pieceIndex)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={isHighlighted ? { 
          scale: [1, 1.3, 1], 
          boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.8)', '0 0 0px rgba(255,255,255,0)']
        } : {}}
        transition={{ duration: 0.5, repeat: isHighlighted ? Infinity : 0 }}
      >
        {/* Player piece icon */}
        <div className="w-3 h-3 rounded-full bg-white opacity-80"></div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <h1 className="text-2xl font-bold">Ludo Game</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>

      <div className="flex gap-6 p-6 justify-center items-start">
        {/* Game Board */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <div 
              className="relative bg-cover bg-center border-4 border-slate-600 rounded-lg shadow-2xl"
              style={{
                width: '500px',
                height: '500px',
                backgroundImage: 'url(/ludo-bg.jpg)'
              }}
            >
              {/* Render all pieces */}
              {Object.keys(gameState.playerPositions).map(playerId => 
                gameState.playerPositions[playerId].map((_, pieceIndex) =>
                  renderPiece(parseInt(playerId), pieceIndex)
                )
              )}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Current Player */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Current Player</h3>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ backgroundColor: playerColors[gameState.currentPlayer] }}
              ></div>
              <span className="text-xl font-bold">{players[gameState.currentPlayer]}</span>
            </div>
          </div>

          {/* Dice */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Dice</h3>
            <div className="flex flex-col items-center gap-4">
              <motion.button
                onClick={rollDice}
                disabled={gameState.isDiceRolled || gameState.isAnimating}
                className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center text-white transition-all
                  ${gameState.isDiceRolled || gameState.isAnimating 
                    ? 'bg-slate-600 border-slate-500 cursor-not-allowed opacity-50' 
                    : 'bg-blue-600 hover:bg-blue-500 border-blue-400 hover:scale-105 active:scale-95'
                  }`}
                whileTap={{ scale: 0.9 }}
              >
                {getDiceIcon(gameState.diceValue)}
              </motion.button>
              <div className="text-2xl font-bold">{gameState.diceValue}</div>
              {!gameState.isDiceRolled && !gameState.isAnimating && (
                <p className="text-sm text-slate-400 text-center">Click to roll dice</p>
              )}
              {gameState.highlightedPieces.length > 0 && (
                <p className="text-sm text-green-400 text-center">Select a highlighted piece to move</p>
              )}
            </div>
          </div>

          {/* Game Rules */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Rules</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Roll 6 to bring pieces out of home</li>
              <li>• Roll 6 to get another turn</li>
              <li>• Land on opponent to send them home</li>
              <li>• Safe zones protect from capture</li>
              <li>• Get all pieces to the center to win</li>
            </ul>
          </div>

          {/* Player Status */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Players</h3>
            <div className="space-y-3">
              {players.map((playerName, index) => {
                const piecesAtHome = gameState.playerPositions[index].filter(pos => pos === -1).length;
                const piecesOnBoard = gameState.playerPositions[index].filter(pos => pos >= 0 && pos < 100).length;
                const piecesInHome = gameState.playerPositions[index].filter(pos => pos >= 100).length;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: playerColors[index] }}
                      ></div>
                      <span className={index === gameState.currentPlayer ? 'font-bold' : ''}>{playerName}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Home: {piecesAtHome} | Board: {piecesOnBoard} | Finished: {piecesInHome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyledLudoGame;