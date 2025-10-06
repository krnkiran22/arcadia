import React, { useState, useRef } from 'react';
import { Home, RotateCcw, Trophy, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const WheelGame = ({ onBackToHome }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastPrize, setLastPrize] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const wheelRef = useRef(null);

  // Wheel segments with prizes
  const prizes = [
    { label: '100', value: 100, color: '#FF6B6B' },
    { label: '50', value: 50, color: '#4ECDC4' },
    { label: '200', value: 200, color: '#45B7D1' },
    { label: '0', value: 0, color: '#96CEB4' },
    { label: '150', value: 150, color: '#FFEAA7' },
    { label: '25', value: 25, color: '#DDA0DD' },
    { label: '300', value: 300, color: '#FF7675' },
    { label: '75', value: 75, color: '#74B9FF' }
  ];

  const segmentAngle = 360 / prizes.length;

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinsLeft(prev => prev - 1);

    // Generate random rotation (minimum 5 full rotations + random position)
    const minSpins = 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (minSpins * 360) + randomAngle;
    
    setRotation(totalRotation);

    // Calculate which prize was won after spinning
    setTimeout(() => {
      // Normalize the final rotation to 0-360 range
      const normalizedRotation = totalRotation % 360;
      // Since the pointer is at the top, we need to account for that
      const adjustedRotation = (360 - normalizedRotation) % 360;
      const winningIndex = Math.floor(adjustedRotation / segmentAngle);
      const wonPrize = prizes[winningIndex];
      
      setLastPrize(wonPrize);
      setTotalPoints(prev => prev + wonPrize.value);
      setGameHistory(prev => [...prev, wonPrize]);
      setIsSpinning(false);
    }, 3000); // Match the animation duration
  };

  const resetGame = () => {
    setIsSpinning(false);
    setRotation(0);
    setSpinsLeft(3);
    setTotalPoints(0);
    setLastPrize(null);
    setGameHistory([]);
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
          
          <h1 className="text-white text-2xl font-bold">Wheel of Fortune</h1>
          
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
            {/* Score & Spins */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Your Score</h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-lime-500 to-green-500 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-black text-sm font-medium">Total Points</div>
                    <div className="text-black text-3xl font-bold">{totalPoints}</div>
                  </div>
                </div>
                
                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-blue-300 text-sm">Spins Remaining</div>
                    <div className="text-white text-2xl font-bold">{spinsLeft}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Prize */}
            {lastPrize && (
              <div className="bg-blue-800 rounded-xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Last Spin</h2>
                <div 
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: lastPrize.color }}
                >
                  <div className="text-white text-sm font-medium">You Won</div>
                  <div className="text-white text-2xl font-bold">{lastPrize.value} Points</div>
                </div>
              </div>
            )}

            {/* Prize List */}
            <div className="bg-blue-800 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Prizes</h2>
              <div className="grid grid-cols-2 gap-2">
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-2 text-center text-sm font-bold text-white"
                    style={{ backgroundColor: prize.color }}
                  >
                    {prize.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Over */}
            {spinsLeft === 0 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6">
                <div className="flex items-center space-x-2 text-white">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-lg">Game Over!</div>
                    <div>Final Score: {totalPoints} points</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wheel */}
          <div className="lg:col-span-2">
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="text-white text-lg font-semibold mb-2">
                  {spinsLeft === 0 ? 'Game Over!' : 
                   isSpinning ? 'Spinning...' : `Spin the wheel! (${spinsLeft} spins left)`}
                </div>
                <div className="text-blue-300 text-sm">
                  Click the spin button to try your luck!
                </div>
              </div>

              {/* Wheel Container */}
              <div className="relative flex items-center justify-center">
                {/* Pointer */}
                <div className="absolute top-0 z-10 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 transform -translate-y-1"></div>
                
                {/* Wheel */}
                <motion.div
                  ref={wheelRef}
                  animate={{ rotate: rotation }}
                  transition={{ 
                    duration: isSpinning ? 3 : 0, 
                    ease: "easeOut" 
                  }}
                  className="relative w-80 h-80 rounded-full border-8 border-yellow-400 shadow-2xl"
                  style={{
                    background: `conic-gradient(${prizes.map((prize, index) => 
                      `${prize.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                    ).join(', ')})`
                  }}
                >
                  {/* Prize Labels */}
                  {prizes.map((prize, index) => {
                    const angle = (index * segmentAngle) + (segmentAngle / 2);
                    const radian = (angle * Math.PI) / 180;
                    const radius = 120;
                    const x = Math.cos(radian - Math.PI / 2) * radius;
                    const y = Math.sin(radian - Math.PI / 2) * radius;
                    
                    return (
                      <div
                        key={index}
                        className="absolute text-white font-bold text-xl transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `50%`,
                          top: `50%`,
                          transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`
                        }}
                      >
                        {prize.label}
                      </div>
                    );
                  })}
                  
                  {/* Center Hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-yellow-400 shadow-lg"></div>
                </motion.div>
              </div>

              {/* Spin Button */}
              <div className="text-center mt-8">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || spinsLeft <= 0}
                  className={`
                    flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg transition-all
                    ${!isSpinning && spinsLeft > 0
                      ? 'bg-lime-500 hover:bg-lime-600 text-black hover:scale-105 cursor-pointer shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <Play className="w-6 h-6" />
                  <span>
                    {isSpinning ? 'Spinning...' : 
                     spinsLeft === 0 ? 'No Spins Left' : 'SPIN WHEEL'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="mt-6 bg-blue-800 rounded-xl p-6">
            <h2 className="text-white text-xl font-bold mb-4">Spin History</h2>
            <div className="flex flex-wrap gap-2">
              {gameHistory.map((prize, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: prize.color }}
                >
                  Spin {index + 1}: {prize.value} pts
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelGame;