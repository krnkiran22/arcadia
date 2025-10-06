import React, { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessground from 'react-chessground';
import { RotateCcw, Home, Trophy } from 'lucide-react';

const ChessGame = ({ onBackToHome }) => {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [thinking, setThinking] = useState(false);

  // Simple AI - makes random valid moves
  const makeRandomMove = useCallback(() => {
    const currentGame = new Chess(fen);
    const possibleMoves = currentGame.moves();
    
    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIndex];
      
      try {
        const result = currentGame.move(move);
        if (result) {
          const newFen = currentGame.fen();
          setFen(newFen);
          setGame(currentGame);
          
          if (currentGame.isGameOver()) {
            setGameOver(true);
            if (currentGame.isCheckmate()) {
              setWinner(currentGame.turn() === 'w' ? 'Black (Bot)' : 'White (You)');
            } else {
              setWinner('Draw');
            }
          }
          
          setIsPlayerTurn(true);
          setThinking(false);
        }
      } catch (error) {
        console.error('Invalid move:', error);
        setThinking(false);
        setIsPlayerTurn(true);
      }
    }
  }, [fen]);

  // Bot move with delay
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setThinking(true);
      const timer = setTimeout(() => {
        makeRandomMove();
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, makeRandomMove]);

  const onMove = useCallback((from, to) => {
    if (!isPlayerTurn || gameOver) return false;

    try {
      const currentGame = new Chess(fen);
      const move = currentGame.move({
        from,
        to,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move) {
        const newFen = currentGame.fen();
        setFen(newFen);
        setGame(currentGame);
        
        if (currentGame.isGameOver()) {
          setGameOver(true);
          if (currentGame.isCheckmate()) {
            setWinner(currentGame.turn() === 'w' ? 'Black (Bot)' : 'White (You)');
          } else {
            setWinner('Draw');
          }
        } else {
          setIsPlayerTurn(false); // Bot's turn
        }
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  }, [fen, isPlayerTurn, gameOver]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setGameOver(false);
    setWinner(null);
    setIsPlayerTurn(true);
    setThinking(false);
  };

  const turnColor = () => {
    const currentGame = new Chess(fen);
    return currentGame.turn() === 'w' ? 'white' : 'black';
  };

  const calcMovable = () => {
    const currentGame = new Chess(fen);
    const dests = new Map();
    currentGame.moves({ verbose: true }).forEach(m => {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    });
    return {
      free: false,
      dests,
      color: isPlayerTurn ? 'white' : undefined
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </button>
          
          <h1 className="text-white text-2xl font-bold">Chess vs Bot</h1>
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info */}
          <div className="bg-blue-800 rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">Game Status</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-blue-300 text-sm mb-1">Current Turn</div>
                <div className="text-white font-semibold">
                  {thinking ? 'Bot is thinking...' : 
                   isPlayerTurn ? 'Your Turn (White)' : 'Bot Turn (Black)'}
                </div>
              </div>

              <div className="bg-blue-700 rounded-lg p-4">
                <div className="text-blue-300 text-sm mb-1">Game Mode</div>
                <div className="text-white font-semibold">Player vs Bot</div>
              </div>

              {gameOver && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Trophy className="w-5 h-5" />
                    <div>
                      <div className="font-bold">Game Over!</div>
                      <div className="text-sm">Winner: {winner}</div>
                    </div>
                  </div>
                </div>
              )}

              {thinking && (
                <div className="bg-yellow-600 rounded-lg p-4">
                  <div className="text-white text-sm">
                    🤖 Bot is calculating the best move...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-2">
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="w-full max-w-lg mx-auto">
                <div className="aspect-square bg-white rounded-lg p-2">
                  <Chessground
                    fen={fen}
                    onMove={onMove}
                    turnColor={turnColor()}
                    movable={calcMovable()}
                    viewOnly={!isPlayerTurn || gameOver}
                    width={400}
                    height={400}
                    coordinates={true}
                    animation={{
                      enabled: true,
                      duration: 200
                    }}
                    highlight={{
                      lastMove: true,
                      check: true
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-blue-300 text-sm">
                  {new Chess(fen).isCheck() && !gameOver && 'Check! '}
                  You are playing as White (bottom pieces)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;