import React, { useState, useEffect, useCallback } from 'react';
import { Home, RotateCcw, Trophy, Dice6, Users, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LudoGame = ({ onBackToHome }) => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0: Red, 1: Blue, 2: Green, 3: Yellow
  const [diceValue, setDiceValue] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  // Player colors and names
  const players = [
    { name: 'Red Player', color: '#EF4444', pieces: [] },
    { name: 'Blue Player', color: '#3B82F6', pieces: [] },
    { name: 'Green Player', color: '#10B981', pieces: [] },
    { name: 'Yellow Player', color: '#F59E0B', pieces: [] }
  ];

  // Game board setup - Ludo has a cross-shaped board with 4 arms
  const boardSize = 15; // 15x15 grid
  const homePositions = {
    0: [1, 1], // Red home area top-left
    1: [1, 9], // Blue home area top-right  
    2: [9, 9], // Green home area bottom-right
    3: [9, 1]  // Yellow home area bottom-left
  };

  // Safe squares where pieces cannot be captured
  const safeSquares = [
    [0, 6], [2, 8], [6, 14], [8, 12], [14, 8], [12, 6], [8, 2], [6, 0], [7, 1], [1, 7], [13, 7], [7, 13]
  ];

  // Starting positions for each player's pieces
  const startingPositions = {
    0: [1, 6], // Red starting square
    1: [6, 1], // Blue starting square  
    2: [8, 13], // Green starting square
    3: [13, 8]  // Yellow starting square
  };

  // Initialize game pieces
  const initializeGame = useCallback(() => {
    const initialPlayers = players.map((player, playerIndex) => ({
      ...player,
      pieces: Array(4).fill(null).map((_, pieceIndex) => ({
        id: `${playerIndex}-${pieceIndex}`,
        position: -1, // -1 means in home area
        isInPlay: false,
        isHome: false, // reached final home
        boardPosition: null
      }))
    }));
    
    setGameLog(['🎲 Ludo game initialized! Red player starts first.']);
    return initialPlayers;
  }, []);

  const [gamePlayers, setGamePlayers] = useState(() => initializeGame());

  // Roll dice
  const rollDice = useCallback(() => {
    if (isRolling || gameState !== 'playing') return;
    
    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(value);
      setIsRolling(false);
      
      const playerName = players[currentPlayer].name;
      setGameLog(prev => [...prev, `🎲 ${playerName} rolled ${value}`]);
      
      // Check if player can move any pieces
      const currentPlayerPieces = gamePlayers[currentPlayer].pieces;
      const canMovePieces = currentPlayerPieces.filter(piece => {
        if (!piece.isInPlay && value === 6) return true; // Can enter with 6
        if (piece.isInPlay && !piece.isHome) return true; // Can move if in play
        return false;
      });
      
      if (canMovePieces.length === 0) {
        // No valid moves, pass turn
        setTimeout(() => {
          passTurn(value);
        }, 1000);
      }
    }, 1000);
  }, [isRolling, gameState, currentPlayer, gamePlayers]);

  // Pass turn to next player
  const passTurn = useCallback((diceRoll) => {
    setGameLog(prev => [...prev, `➡️ ${players[currentPlayer].name} has no valid moves, turn passed.`]);
    
    // Only stay on same player if rolled 6, otherwise next player
    if (diceRoll !== 6) {
      setCurrentPlayer(prev => (prev + 1) % 4);
    }
    setSelectedPiece(null);
    setDiceValue(0);
  }, [currentPlayer]);

  // Move piece
  const movePiece = useCallback((playerIndex, pieceIndex) => {
    if (playerIndex !== currentPlayer || diceValue === 0) return;
    
    const newPlayers = [...gamePlayers];
    const piece = newPlayers[playerIndex].pieces[pieceIndex];
    
    // Enter piece into play with 6
    if (!piece.isInPlay && diceValue === 6) {
      piece.isInPlay = true;
      piece.position = 0; // Starting position on the track
      piece.boardPosition = startingPositions[playerIndex];
      
      setGameLog(prev => [...prev, `🚀 ${players[playerIndex].name} entered a piece into play!`]);
    }
    // Move piece if in play
    else if (piece.isInPlay && !piece.isHome) {
      const newPosition = piece.position + diceValue;
      
      // Check if piece reaches home (52 squares + 5 home squares = 57 total)
      if (newPosition >= 57) {
        piece.isHome = true;
        piece.position = 57;
        setGameLog(prev => [...prev, `🏠 ${players[playerIndex].name} got a piece home!`]);
        
        // Check for win condition (all 4 pieces home)
        const allPiecesHome = newPlayers[playerIndex].pieces.every(p => p.isHome);
        if (allPiecesHome) {
          setWinner(players[playerIndex].name);
          setGameState('gameOver');
          setGameLog(prev => [...prev, `🎉 ${players[playerIndex].name} wins the game!`]);
        }
      } else {
        piece.position = newPosition;
        // Calculate board position (simplified for demo)
        piece.boardPosition = calculateBoardPosition(playerIndex, newPosition);
        
        setGameLog(prev => [...prev, `📍 ${players[playerIndex].name} moved a piece to position ${newPosition}`]);
      }
    }
    
    setGamePlayers(newPlayers);
    
    // Pass turn (stay if rolled 6)
    if (diceValue !== 6) {
      setTimeout(() => {
        setCurrentPlayer(prev => (prev + 1) % 4);
      }, 500);
    }
    
    setSelectedPiece(null);
    setDiceValue(0);
  }, [currentPlayer, diceValue, gamePlayers]);

  // Calculate board position (simplified version)
  const calculateBoardPosition = (playerIndex, position) => {
    // This is a simplified calculation for demo purposes
    // In a real Ludo game, you'd have a complete track mapping
    const basePositions = [
      [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6],
      [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [6, 9],
      [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14], [8, 13], [8, 12],
      [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
      [14, 7], [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 6], [8, 5],
      [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0]
    ];
    
    const adjustedPosition = (position + playerIndex * 13) % 52;
    return basePositions[adjustedPosition] || [7, 7];
  };

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setGameStarted(true);
    setCurrentPlayer(0);
    setGamePlayers(initializeGame());
  }, [initializeGame]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState('menu');
    setGameStarted(false);
    setCurrentPlayer(0);
    setDiceValue(0);
    setIsRolling(false);
    setWinner(null);
    setSelectedPiece(null);
    setGameLog([]);
    setGamePlayers(initializeGame());
  }, [initializeGame]);

  // Render board square
  const renderSquare = (row, col) => {
    const isHomeArea = (row >= 1 && row <= 5 && col >= 1 && col <= 5) || // Red home
                      (row >= 1 && row <= 5 && col >= 9 && col <= 13) || // Blue home
                      (row >= 9 && row <= 13 && col >= 9 && col <= 13) || // Green home
                      (row >= 9 && row <= 13 && col >= 1 && col <= 5); // Yellow home
    
    const isPath = (row === 6 || row === 8 || col === 6 || col === 8) && !isHomeArea;
    const isSafe = safeSquares.some(([r, c]) => r === row && c === col);
    const isCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;
    
    // Find pieces on this square
    const piecesOnSquare = [];
    gamePlayers.forEach((player, playerIndex) => {
      player.pieces.forEach((piece, pieceIndex) => {
        if (piece.boardPosition && piece.boardPosition[0] === row && piece.boardPosition[1] === col) {
          piecesOnSquare.push({ playerIndex, pieceIndex, piece });
        }
      });
    });
    
    let squareColor = 'bg-white';
    if (isCenter) squareColor = 'bg-yellow-200';
    else if (isSafe) squareColor = 'bg-green-200';
    else if (isPath) squareColor = 'bg-gray-100';
    else if (isHomeArea) {
      if (row >= 1 && row <= 5 && col >= 1 && col <= 5) squareColor = 'bg-red-100';
      else if (row >= 1 && row <= 5 && col >= 9 && col <= 13) squareColor = 'bg-blue-100';
      else if (row >= 9 && row <= 13 && col >= 9 && col <= 13) squareColor = 'bg-green-100';
      else if (row >= 9 && row <= 13 && col >= 1 && col <= 5) squareColor = 'bg-yellow-100';
    }
    
    return (
      <div
        key={`${row}-${col}`}
        className={`w-8 h-8 border border-gray-300 ${squareColor} relative flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors`}
        onClick={() => {
          // Handle square click if needed
        }}
      >
        {/* Render pieces on this square */}
        {piecesOnSquare.map(({ playerIndex, pieceIndex, piece }, index) => (
          <motion.div
            key={`${playerIndex}-${pieceIndex}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer shadow-md ${
              selectedPiece === `${playerIndex}-${pieceIndex}` ? 'ring-2 ring-black' : ''
            }`}
            style={{ 
              backgroundColor: players[playerIndex].color,
              zIndex: 10 + index,
              transform: `translate(${index * 4}px, ${index * 4}px)`
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (playerIndex === currentPlayer) {
                setSelectedPiece(`${playerIndex}-${pieceIndex}`);
                movePiece(playerIndex, pieceIndex);
              }
            }}
          />
        ))}
        
        {/* Square markers */}
        {isSafe && <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>}
        {isCenter && <div className="text-yellow-600">🏠</div>}
      </div>
    );
  };

  // Render home area pieces (not yet in play)
  const renderHomePieces = (playerIndex) => {
    const player = gamePlayers[playerIndex];
    const homePieces = player.pieces.filter(piece => !piece.isInPlay && !piece.isHome);
    
    return (
      <div className="flex flex-wrap gap-1">
        {homePieces.map((piece, index) => (
          <motion.div
            key={piece.id}
            className={`w-6 h-6 rounded-full border-2 border-white cursor-pointer shadow-md ${
              selectedPiece === piece.id ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: players[playerIndex].color }}
            onClick={() => {
              if (playerIndex === currentPlayer && diceValue === 6) {
                setSelectedPiece(piece.id);
                movePiece(playerIndex, index);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </button>
          
          <h1 className="text-white text-3xl font-bold">🎲 Ludo Game</h1>
          
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
              <div className="text-8xl mb-6">🎲</div>
              <h2 className="text-white text-4xl font-bold mb-6">Welcome to Ludo!</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                🏠 Classic 4-player board game <br/>
                🎲 Roll dice to move your pieces <br/>
                🚀 Get all 4 pieces home to win! <br/>
                ⭐ Roll 6 to enter pieces or get extra turn
              </p>
              <button
                onClick={startGame}
                className="flex items-center space-x-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black px-8 py-4 rounded-xl text-xl font-bold mx-auto transition-all transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Game Info Panel */}
            <div className="space-y-6">
              {/* Current Player */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Current Turn</h2>
                <div 
                  className="flex items-center space-x-3 p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: `${players[currentPlayer].color}20`,
                    borderColor: players[currentPlayer].color 
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: players[currentPlayer].color }}
                  ></div>
                  <span className="text-white font-bold text-lg">
                    {players[currentPlayer].name}
                  </span>
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
                    disabled={isRolling || gameState !== 'playing' || diceValue > 0}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all w-full justify-center transform
                      ${!isRolling && gameState === 'playing' && diceValue === 0
                        ? 'bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black cursor-pointer hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <Dice6 className="w-5 h-5" />
                    <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
                  </button>
                </div>
              </div>

              {/* Player Status */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Players Status</h2>
                <div className="space-y-3">
                  {players.map((player, index) => {
                    const playerData = gamePlayers[index];
                    const piecesHome = playerData.pieces.filter(p => p.isHome).length;
                    const piecesInPlay = playerData.pieces.filter(p => p.isInPlay && !p.isHome).length;
                    
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${
                          currentPlayer === index ? 'border-white bg-white/10' : 'border-transparent bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-white"
                              style={{ backgroundColor: player.color }}
                            ></div>
                            <span className="text-white text-sm font-medium">{player.name}</span>
                          </div>
                        </div>
                        <div className="text-xs text-white/70">
                          🏠 Home: {piecesHome}/4 | 🎯 In Play: {piecesInPlay}
                        </div>
                        
                        {/* Home pieces display */}
                        <div className="mt-2">
                          {renderHomePieces(index)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Game Over */}
              {gameState === 'gameOver' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-3 text-white text-center">
                    <Trophy className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-xl">Game Over!</div>
                      <div className="text-lg">{winner} Wins! 🎉</div>
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
                    🏠 Ludo Board Game
                  </div>
                  <div className="text-white/80 text-sm">
                    Roll dice and move your pieces clockwise around the board to home!
                  </div>
                </div>
                
                {/* Ludo Board */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-2xl">
                    <div className="grid gap-0 border-2 border-gray-800" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                      {Array.from({ length: boardSize }, (_, row) =>
                        Array.from({ length: boardSize }, (_, col) => renderSquare(row, col))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-white/80 text-sm">
                    🎲 Roll 6 to enter pieces | ⭐ Get all pieces home to win | 🔄 Roll 6 for extra turn
                  </p>
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

export default LudoGame;