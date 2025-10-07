import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, RotateCcw, Trophy, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlappyBirdGame = ({ onBackToHome }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappyBirdHighScore') || '0');
  });

  // Game variables
  const gameRef = useRef({
    bird: {
      x: 50,
      y: 200,
      velocity: 0,
      gravity: 0.5,
      jumpForce: -8,
      size: 20
    },
    pipes: [],
    canvas: {
      width: 800,
      height: 600
    },
    gameSpeed: 2,
    pipeWidth: 60,
    pipeGap: 150,
    pipeSpacing: 300,
    lastPipeX: 300
  });

  // Colors and theme
  const colors = {
    sky: '#87CEEB',
    ground: '#DEB887',
    bird: '#FFD700',
    birdWing: '#FFA500',
    pipe: '#228B22',
    pipeHighlight: '#32CD32'
  };

  // Initialize game
  const initGame = useCallback(() => {
    const game = gameRef.current;
    game.bird = {
      x: 50,
      y: 200,
      velocity: 0,
      gravity: 0.5,
      jumpForce: -8,
      size: 20
    };
    game.pipes = [];
    game.lastPipeX = 300;
    setScore(0);
  }, []);

  // Create new pipe pair
  const createPipe = useCallback((x) => {
    const game = gameRef.current;
    const minHeight = 50;
    const maxHeight = game.canvas.height - game.pipeGap - minHeight - 100; // Leave space for ground
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
      x: x,
      topHeight: topHeight,
      bottomY: topHeight + game.pipeGap,
      bottomHeight: game.canvas.height - (topHeight + game.pipeGap) - 100,
      passed: false
    };
  }, []);

  // Bird jump
  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.bird.velocity = gameRef.current.bird.jumpForce;
    }
  }, [gameState]);

  // Check collision
  const checkCollision = useCallback(() => {
    const game = gameRef.current;
    const bird = game.bird;
    
    // Ground collision
    if (bird.y + bird.size > game.canvas.height - 100) {
      return true;
    }
    
    // Ceiling collision
    if (bird.y < 0) {
      return true;
    }
    
    // Pipe collision
    for (let pipe of game.pipes) {
      if (bird.x + bird.size > pipe.x && 
          bird.x < pipe.x + game.pipeWidth) {
        if (bird.y < pipe.topHeight || 
            bird.y + bird.size > pipe.bottomY) {
          return true;
        }
      }
    }
    
    return false;
  }, []);

  // Update game logic
  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const game = gameRef.current;
    const bird = game.bird;
    
    // Update bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Update pipes
    game.pipes.forEach(pipe => {
      pipe.x -= game.gameSpeed;
      
      // Score when passing pipe
      if (!pipe.passed && bird.x > pipe.x + game.pipeWidth) {
        pipe.passed = true;
        setScore(prev => prev + 1);
      }
    });
    
    // Remove pipes that are off screen
    game.pipes = game.pipes.filter(pipe => pipe.x + game.pipeWidth > -50);
    
    // Add new pipes
    if (game.pipes.length === 0 || 
        game.pipes[game.pipes.length - 1].x < game.canvas.width - game.pipeSpacing) {
      game.pipes.push(createPipe(game.canvas.width));
    }
    
    // Check collision
    if (checkCollision()) {
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappyBirdHighScore', score.toString());
      }
    }
  }, [gameState, score, highScore, createPipe, checkCollision]);

  // Draw functions
  const drawBackground = useCallback((ctx) => {
    const game = gameRef.current;
    
    // Sky
    ctx.fillStyle = colors.sky;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height - 100);
    
    // Ground
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, game.canvas.height - 100, game.canvas.width, 100);
    
    // Clouds (simple)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 200 + Date.now() * 0.02) % (game.canvas.width + 100);
      ctx.beginPath();
      ctx.arc(x, 80 + i * 30, 30, 0, Math.PI * 2);
      ctx.arc(x + 20, 80 + i * 30, 25, 0, Math.PI * 2);
      ctx.arc(x + 40, 80 + i * 30, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawBird = useCallback((ctx) => {
    const bird = gameRef.current.bird;
    
    // Bird body
    ctx.fillStyle = colors.bird;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird wing
    ctx.fillStyle = colors.birdWing;
    ctx.beginPath();
    ctx.ellipse(bird.x - 5, bird.y, 8, 12, Math.sin(Date.now() * 0.01) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.size - 5, bird.y);
    ctx.lineTo(bird.x + bird.size + 5, bird.y - 2);
    ctx.lineTo(bird.x + bird.size + 5, bird.y + 2);
    ctx.closePath();
    ctx.fill();
  }, []);

  const drawPipes = useCallback((ctx) => {
    const game = gameRef.current;
    
    game.pipes.forEach(pipe => {
      // Top pipe
      ctx.fillStyle = colors.pipe;
      ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
      
      // Top pipe cap
      ctx.fillStyle = colors.pipeHighlight;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, game.pipeWidth + 10, 20);
      
      // Bottom pipe
      ctx.fillStyle = colors.pipe;
      ctx.fillRect(pipe.x, pipe.bottomY, game.pipeWidth, pipe.bottomHeight);
      
      // Bottom pipe cap
      ctx.fillStyle = colors.pipeHighlight;
      ctx.fillRect(pipe.x - 5, pipe.bottomY, game.pipeWidth + 10, 20);
    });
  }, []);

  const drawScore = useCallback((ctx) => {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    
    const text = score.toString();
    ctx.strokeText(text, gameRef.current.canvas.width / 2, 50);
    ctx.fillText(text, gameRef.current.canvas.width / 2, 50);
  }, [score]);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground(ctx);
    drawPipes(ctx);
    drawBird(ctx);
    
    if (gameState === 'playing') {
      drawScore(ctx);
    }
  }, [gameState, drawBackground, drawPipes, drawBird, drawScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    updateGame();
    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, render]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  }, [gameState]);

  // Restart game
  const restartGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  // Event listeners
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'menu' || gameState === 'gameOver') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };

    const handleClick = () => {
      if (gameState === 'playing') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [gameState, jump, startGame]);

  // Game loop management
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Initial render
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
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
          
          <h1 className="text-white text-3xl font-bold">🐦 Flappy Bird</h1>
          
          <div className="flex items-center space-x-4">
            {gameState === 'playing' && (
              <button
                onClick={pauseGame}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={restartGame}
              className="flex items-center space-x-2 bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Info */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Score</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{score}</div>
                <div className="text-white/80 text-sm">Current Score</div>
              </div>
            </div>

            {/* High Score */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">🏆 High Score</h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">{highScore}</div>
                <div className="text-white/80 text-sm">Best Score</div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Controls</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Jump:</span>
                  <span className="text-white font-medium">Spacebar / Click</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Start:</span>
                  <span className="text-white font-medium">Spacebar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Pause:</span>
                  <span className="text-white font-medium">Pause Button</span>
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Status</h2>
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  gameState === 'playing' ? 'bg-green-500 text-black' :
                  gameState === 'paused' ? 'bg-yellow-500 text-black' :
                  gameState === 'gameOver' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {gameState === 'playing' ? '🎮 Playing' :
                   gameState === 'paused' ? '⏸️ Paused' :
                   gameState === 'gameOver' ? '💀 Game Over' :
                   '🏠 Menu'}
                </div>
              </div>
            </div>
          </div>

          {/* Game Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full max-w-4xl mx-auto border-4 border-white/20 rounded-lg bg-gradient-to-b from-sky-300 to-sky-500"
                  style={{ aspectRatio: '4/3' }}
                />

                {/* Game Overlays */}
                <AnimatePresence>
                  {gameState === 'menu' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4">🐦</div>
                        <h2 className="text-white text-4xl font-bold mb-4">Flappy Bird</h2>
                        <p className="text-white/80 text-lg mb-8">
                          Press SPACEBAR or click to start flying!
                        </p>
                        <button
                          onClick={startGame}
                          className="flex items-center space-x-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black px-8 py-4 rounded-xl text-xl font-bold mx-auto transition-all transform hover:scale-105"
                        >
                          <Play className="w-6 h-6" />
                          <span>Start Game</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {gameState === 'paused' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4">⏸️</div>
                        <h2 className="text-white text-4xl font-bold mb-4">Paused</h2>
                        <button
                          onClick={pauseGame}
                          className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl text-xl font-bold mx-auto transition-all transform hover:scale-105"
                        >
                          <Play className="w-6 h-6" />
                          <span>Resume</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {gameState === 'gameOver' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg"
                    >
                      <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8">
                        <div className="text-6xl mb-4">💀</div>
                        <h2 className="text-white text-4xl font-bold mb-4">Game Over!</h2>
                        <div className="text-white/80 text-xl mb-2">Score: <span className="text-yellow-400 font-bold">{score}</span></div>
                        <div className="text-white/80 text-lg mb-8">High Score: <span className="text-orange-400 font-bold">{highScore}</span></div>
                        {score > highScore && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-lime-400 text-xl font-bold mb-4"
                          >
                            🎉 New High Score! 🎉
                          </motion.div>
                        )}
                        <div className="space-y-4">
                          <button
                            onClick={startGame}
                            className="flex items-center space-x-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black px-8 py-4 rounded-xl text-xl font-bold mx-auto transition-all transform hover:scale-105"
                          >
                            <Play className="w-6 h-6" />
                            <span>Play Again</span>
                          </button>
                          <p className="text-white/60 text-sm">Press SPACEBAR to play again</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm">
                  Navigate through pipes without touching them. Click or press spacebar to flap!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBirdGame;