import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BASE_POSITIONS, 
    HOME_ENTRANCE, 
    HOME_POSITIONS, 
    PLAYERS, 
    SAFE_POSITIONS, 
    START_POSITIONS, 
    STATE, 
    TURNING_POINTS,
    COORDINATES_MAP,
    STEP_LENGTH
} from './ludo/constants.js';

const ReactLudoGame = ({ onBackToHome }) => {
    const [currentPositions, setCurrentPositions] = useState({
        P1: [...BASE_POSITIONS.P1],
        P2: [...BASE_POSITIONS.P2]
    });
    
    const [diceValue, setDiceValue] = useState(1);
    const [turn, setTurn] = useState(0);
    const [gameState, setGameState] = useState(STATE.DICE_NOT_ROLLED);
    const [highlightedPieces, setHighlightedPieces] = useState([]);
    const [isMoving, setIsMoving] = useState(false);

    // Initialize game
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = useCallback(() => {
        setCurrentPositions({
            P1: [...BASE_POSITIONS.P1],
            P2: [...BASE_POSITIONS.P2]
        });
        setTurn(0);
        setGameState(STATE.DICE_NOT_ROLLED);
        setHighlightedPieces([]);
        setDiceValue(1);
    }, []);

    const rollDice = () => {
        if (gameState !== STATE.DICE_NOT_ROLLED || isMoving) return;
        
        const newDiceValue = 1 + Math.floor(Math.random() * 6);
        setDiceValue(newDiceValue);
        setGameState(STATE.DICE_ROLLED);
        
        setTimeout(() => checkForEligiblePieces(newDiceValue), 500);
    };

    const checkForEligiblePieces = (diceVal = diceValue) => {
        const player = PLAYERS[turn];
        const eligiblePieces = getEligiblePieces(player, diceVal);
        
        if (eligiblePieces.length > 0) {
            setHighlightedPieces(eligiblePieces.map(piece => ({ player, piece })));
        } else {
            incrementTurn();
        }
    };

    const getEligiblePieces = (player, diceVal = diceValue) => {
        return [0, 1, 2, 3].filter(piece => {
            const currentPosition = currentPositions[player][piece];

            if (currentPosition === HOME_POSITIONS[player]) {
                return false;
            }

            if (BASE_POSITIONS[player].includes(currentPosition) && diceVal !== 6) {
                return false;
            }

            if (
                HOME_ENTRANCE[player].includes(currentPosition) &&
                diceVal > HOME_POSITIONS[player] - currentPosition
            ) {
                return false;
            }

            return true;
        });
    };

    const incrementTurn = () => {
        setTurn(prevTurn => prevTurn === 0 ? 1 : 0);
        setGameState(STATE.DICE_NOT_ROLLED);
        setHighlightedPieces([]);
    };

    const handlePieceClick = (player, piece) => {
        const isHighlighted = highlightedPieces.some(h => h.player === player && h.piece === piece);
        if (!isHighlighted || isMoving) return;

        setIsMoving(true);
        setHighlightedPieces([]);

        const currentPosition = currentPositions[player][piece];
        
        if (BASE_POSITIONS[player].includes(currentPosition)) {
            setPiecePosition(player, piece, START_POSITIONS[player]);
            setGameState(STATE.DICE_NOT_ROLLED);
            setIsMoving(false);
            return;
        }

        movePiece(player, piece, diceValue);
    };

    const setPiecePosition = (player, piece, newPosition) => {
        setCurrentPositions(prev => ({
            ...prev,
            [player]: prev[player].map((pos, index) => index === piece ? newPosition : pos)
        }));
    };

    const movePiece = (player, piece, moveBy) => {
        let moves = moveBy;
        const interval = setInterval(() => {
            setPiecePosition(player, piece, getIncrementedPosition(player, piece));
            moves--;

            if (moves === 0) {
                clearInterval(interval);
                setIsMoving(false);

                // Check if player won
                if (hasPlayerWon(player)) {
                    setTimeout(() => {
                        alert(`Player ${player} has won!`);
                        resetGame();
                    }, 100);
                    return;
                }

                const isKill = checkForKill(player, piece);

                if (isKill || diceValue === 6) {
                    setGameState(STATE.DICE_NOT_ROLLED);
                    return;
                }

                incrementTurn();
            }
        }, 200);
    };

    const getIncrementedPosition = (player, piece) => {
        const currentPosition = currentPositions[player][piece];

        if (currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        } else if (currentPosition === 51) {
            return 0;
        }
        return currentPosition + 1;
    };

    const checkForKill = (player, piece) => {
        const currentPosition = currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';
        let kill = false;

        [0, 1, 2, 3].forEach(opponentPiece => {
            const opponentPosition = currentPositions[opponent][opponentPiece];

            if (currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition)) {
                setPiecePosition(opponent, opponentPiece, BASE_POSITIONS[opponent][opponentPiece]);
                kill = true;
            }
        });

        return kill;
    };

    const hasPlayerWon = (player) => {
        return [0, 1, 2, 3].every(piece => currentPositions[player][piece] === HOME_POSITIONS[player]);
    };

    const getPieceStyle = (player, piece) => {
        const position = currentPositions[player][piece];
        const coordinates = COORDINATES_MAP[position];
        
        if (!coordinates) return {};
        
        const [x, y] = coordinates;
        return {
            left: `${x * STEP_LENGTH}%`,
            top: `${y * STEP_LENGTH}%`,
        };
    };

    const isPieceHighlighted = (player, piece) => {
        return highlightedPieces.some(h => h.player === player && h.piece === piece);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="flex justify-between items-center w-full max-w-2xl mb-6">
                <motion.button
                    onClick={onBackToHome}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ← Back to Games
                </motion.button>
                
                <h1 className="text-3xl font-bold text-gray-800">Traditional Ludo</h1>
                
                <motion.button
                    onClick={resetGame}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Reset Game
                </motion.button>
            </div>

            {/* Game Controls */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center w-full max-w-2xl">
                <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">
                        Active Player: 
                        <span className={`ml-2 px-3 py-1 rounded-full text-white ${
                            PLAYERS[turn] === 'P1' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                            {PLAYERS[turn] === 'P1' ? 'Blue' : 'Green'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="text-xl font-bold">Dice: {diceValue}</div>
                    <motion.button
                        onClick={rollDice}
                        disabled={gameState !== STATE.DICE_NOT_ROLLED || isMoving}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            gameState === STATE.DICE_NOT_ROLLED && !isMoving
                                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        whileHover={gameState === STATE.DICE_NOT_ROLLED && !isMoving ? { scale: 1.05 } : {}}
                        whileTap={gameState === STATE.DICE_NOT_ROLLED && !isMoving ? { scale: 0.95 } : {}}
                    >
                        Roll Dice
                    </motion.button>
                </div>
            </div>

            {/* Ludo Board */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-4">
                <div 
                    className="relative bg-cover bg-center bg-no-repeat"
                    style={{
                        width: '450px',
                        height: '450px',
                        backgroundImage: 'url(/ludo-bg.jpg)',
                        backgroundSize: 'contain'
                    }}
                >
                    {/* Player Base Highlights */}
                    <div className={`absolute bottom-0 left-0 w-2/5 h-2/5 border-8 ${
                        PLAYERS[turn] === 'P1' ? 'border-blue-400 animate-pulse' : 'border-transparent'
                    }`} />
                    
                    <div className={`absolute top-0 right-0 w-2/5 h-2/5 border-8 ${
                        PLAYERS[turn] === 'P2' ? 'border-green-400 animate-pulse' : 'border-transparent'
                    }`} />

                    {/* Player Pieces */}
                    <div className="absolute inset-0">
                        {PLAYERS.map(player => 
                            [0, 1, 2, 3].map(piece => (
                                <motion.div
                                    key={`${player}-${piece}`}
                                    className={`absolute w-3 h-3 border-2 rounded-full cursor-pointer transition-all transform -translate-x-1/2 -translate-y-1/2 z-10 ${
                                        player === 'P1' 
                                            ? 'bg-blue-500 border-blue-700' 
                                            : 'bg-green-500 border-green-700'
                                    } ${
                                        isPieceHighlighted(player, piece) 
                                            ? 'border-dashed border-yellow-400 animate-pulse scale-150' 
                                            : ''
                                    }`}
                                    style={getPieceStyle(player, piece)}
                                    onClick={() => handlePieceClick(player, piece)}
                                    whileHover={isPieceHighlighted(player, piece) ? { scale: 1.8 } : { scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={isPieceHighlighted(player, piece) ? {
                                        rotate: [0, 180, 360],
                                        scale: [1.5, 1.8, 1.5]
                                    } : {}}
                                    transition={isPieceHighlighted(player, piece) ? {
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    } : {}}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Game Instructions */}
            <div className="mt-6 text-center text-gray-600 max-w-2xl">
                <p className="mb-2">Click "Roll Dice" to play your turn. Move pieces by clicking on highlighted pieces.</p>
                <p className="text-sm">Get all your pieces to the center to win!</p>
            </div>
            
            {/* Game Status */}
            {isMoving && (
                <motion.div 
                    className="mt-4 px-4 py-2 bg-yellow-200 text-yellow-800 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Moving piece...
                </motion.div>
            )}
        </div>
    );
};

export default ReactLudoGame;