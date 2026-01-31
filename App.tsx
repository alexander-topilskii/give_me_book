import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { ControlPanel } from './components/ControlPanel';
import { Player, GamePhase, TranslationPair } from './types';
import { generateQuestions, PLAYER_CONFIG, TOTAL_STEPS, WINNING_STEPS } from './constants';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([
    { ...PLAYER_CONFIG[0], position: 0 },
    { ...PLAYER_CONFIG[1], position: 0 }
  ]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.TASK_REVEAL);
  
  // Question deck management
  const [deck, setDeck] = useState<TranslationPair[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<TranslationPair | null>(null);
  
  const [winner, setWinner] = useState<Player | null>(null);

  // Initialize Game
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = () => {
    setPlayers([
      { ...PLAYER_CONFIG[0], position: 0 },
      { ...PLAYER_CONFIG[1], position: 0 }
    ]);
    setDeck(generateQuestions());
    setCurrentPlayerIdx(0);
    setPhase(GamePhase.TASK_REVEAL);
    setWinner(null);
    setCurrentQuestion(null);
  };

  // Pull a card
  const handleStartTurn = useCallback(() => {
    let nextDeck = [...deck];
    if (nextDeck.length === 0) {
      nextDeck = generateQuestions(); // Reshuffle if empty
    }
    const question = nextDeck.pop();
    setDeck(nextDeck);
    
    if (question) {
        setCurrentQuestion(question);
        setPhase(GamePhase.ANSWER_CHECK);
    }
  }, [deck]);

  const handleReveal = useCallback(() => {
    setPhase(GamePhase.MOVEMENT);
  }, []);

  const handleGrade = useCallback((errors: number) => {
    // Calculate movement
    let moveAmount = 0;
    if (errors === 0) moveAmount = 2;
    else if (errors === 1) moveAmount = 1;
    else if (errors === 2) moveAmount = 0;
    else moveAmount = -1;

    setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        const p = newPlayers[currentPlayerIdx];
        
        let newPos = p.position + moveAmount;
        // Clamp bounds
        if (newPos < 0) newPos = 0;
        if (newPos > WINNING_STEPS) newPos = WINNING_STEPS;
        
        p.position = newPos;

        // Check Win Condition immediately
        if (newPos === WINNING_STEPS) {
            setWinner(p);
            setPhase(GamePhase.WIN);
        } else {
             // Switch turn logic if not win
             setTimeout(() => {
                 setCurrentPlayerIdx(prev => (prev === 0 ? 1 : 0));
                 setPhase(GamePhase.TASK_REVEAL);
                 setCurrentQuestion(null);
             }, 800);
        }

        return newPlayers;
    });
  }, [currentPlayerIdx]);

  const isPlayer2Turn = currentPlayerIdx === 1;

  return (
    <div className="relative w-full h-[100dvh] bg-slate-100 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Central Board Area */}
      {/* We add some padding top/bottom to ensure the board isn't fully covered by the controls */}
      <div className="w-full max-w-2xl p-4 flex-1 flex items-center justify-center transition-all duration-500">
         <div className="w-full relative z-10 scale-90 sm:scale-100">
             <h1 className={`text-xl font-bold text-center text-slate-400 mb-4 tracking-wide uppercase transition-all duration-500 ${isPlayer2Turn ? 'rotate-180' : ''}`}>
                Greek Grammar Journey
            </h1>
            <GameBoard 
                players={players} 
                currentPlayerId={currentPlayerIdx}
            />
         </div>
      </div>

      {/* Control Panel Layer */}
      {/* 
         This container moves between top and bottom.
         Player 1 (Index 0): Bottom, Normal rotation.
         Player 2 (Index 1): Top, 180deg rotation.
      */}
      <div 
        className={`absolute left-0 right-0 z-30 transition-all duration-700 ease-in-out transform
            ${isPlayer2Turn ? 'top-0 rotate-180' : 'bottom-0 rotate-0'}
        `}
      >
         <ControlPanel 
            phase={phase}
            currentPlayer={players[currentPlayerIdx]}
            currentQuestion={currentQuestion}
            onNextTurn={handleStartTurn}
            onReveal={handleReveal}
            onGrade={handleGrade}
            gameWinner={winner}
            onReset={resetGame}
         />
      </div>

      {/* Overlay for Winner (Global) */}
      {winner && (
         <div className={`absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 transition-transform duration-500 ${winner.id === 1 ? 'rotate-180' : ''}`}>
             <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
                <h2 className="text-4xl font-bold mb-4">🎉 Συγχαρητήρια! 🎉</h2>
                <p className="text-xl mb-8 text-slate-600">
                    Победитель: <br/>
                    <span className={`text-3xl ${winner.id === 0 ? 'text-indigo-600' : 'text-rose-600'} font-bold`}>{winner.name}</span>
                </p>
                <button 
                    onClick={resetGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    Новая игра
                </button>
             </div>
         </div>
      )}

    </div>
  );
}