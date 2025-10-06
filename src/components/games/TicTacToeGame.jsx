import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Trophy } from 'lucide-react';

const TicTacToeGame = ({ onBackToHome }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0, draws: 0 });

  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  // Check for winner
  const checkWinner = (currentBoard) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    
    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  };

  // Simple AI using minimax algorithm
  const getBestMove = (currentBoard) => {
    const availableMoves = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null);

    // Try to win
    for (let move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return move;
      }
    }

    // Try to block player from winning
    for (let move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  // Handle cell click
  const handleCellClick = (index) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setGameOver(true);
      if (result === 'X') {
        setWinner('You Win! 🎉');
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (result === 'draw') {
        setWinner('It\'s a Draw! 🤝');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  // Bot move
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const botMove = getBestMove(board);
        const newBoard = [...board];
        newBoard[botMove] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          setGameOver(true);
          if (result === 'O') {
            setWinner('Bot Wins! 🤖');
            setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
          } else if (result === 'draw') {
            setWinner('It\'s a Draw! 🤝');
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          }
        } else {
          setIsPlayerTurn(true);
        }
      }, 500 + Math.random() * 1500); // Random delay 0.5-2 seconds

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ player: 0, bot: 0, draws: 0 });
    resetGame();
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
          
          <h1 className="text-white text-2xl font-bold">Tic Tac Toe vs Bot</h1>
          
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
          <div className="space-y-6">
            {/* Scores */}
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Scores</h2>
                <button
                  onClick={resetScores}
                  className="text-blue-300 hover:text-white text-sm"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-blue-700 rounded-lg p-3">
                  <span className="text-white">You (X)</span>
                  <span className="text-lime-400 font-bold text-xl">{scores.player}</span>
                </div>
                <div className="flex justify-between items-center bg-blue-700 rounded-lg p-3">
                  <span className="text-white">Bot (O)</span>
                  <span className="text-red-400 font-bold text-xl">{scores.bot}</span>
                </div>
                <div className="flex justify-between items-center bg-blue-700 rounded-lg p-3">
                  <span className="text-white">Draws</span>
                  <span className="text-yellow-400 font-bold text-xl">{scores.draws}</span>
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Game Status</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="text-blue-300 text-sm mb-1">Current Turn</div>
                  <div className="text-white font-semibold">
                    {gameOver ? 'Game Over' : 
                     isPlayerTurn ? 'Your Turn (X)' : 'Bot is thinking... (O)'}
                  </div>
                </div>

                {gameOver && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Trophy className="w-5 h-5" />
                      <div>
                        <div className="font-bold">Game Over!</div>
                        <div className="text-sm">{winner}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="w-full max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-2 bg-blue-900 p-4 rounded-xl">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={cell !== null || gameOver || !isPlayerTurn}
                      className={`
                        aspect-square bg-blue-700 hover:bg-blue-600 rounded-lg 
                        flex items-center justify-center text-4xl font-bold
                        transition-all duration-200 border-2 border-blue-600
                        ${cell === 'X' ? 'text-lime-400' : cell === 'O' ? 'text-red-400' : 'text-white'}
                        ${!cell && isPlayerTurn && !gameOver ? 'hover:border-lime-400 cursor-pointer' : ''}
                        ${!cell && !isPlayerTurn && !gameOver ? 'opacity-50' : ''}
                      `}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-blue-300 text-sm">
                  You are X, Bot is O. Get 3 in a row to win!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;