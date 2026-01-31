import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { ControlPanel } from './components/ControlPanel';
import { Player, GamePhase, TranslationPair } from './types';
import { generateQuestions, PLAYER_CONFIG, TOTAL_STEPS, WINNING_STEPS } from './constants';
import { Maximize, Minimize } from 'lucide-react';

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
  
  // Used to regenerate the board layout
  const [gameId, setGameId] = useState(0);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    setGameId(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
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
    <div className="relative w-full h-[100dvh] bg-slate-100 overflow-hidden flex flex-col items-center justify-center touch-none">
      
      {/* Fullscreen Button (Fixed UI, does not rotate) */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg text-slate-600 hover:text-indigo-600 transition-colors"
        title="На весь экран"
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>

      {/* Central Board Area */}
      {/* 
          Strategy: 
          We use a height-driven approach for sizing the board container to ensure aspect ratio is maintained
          without collapsing on desktop.
          Mobile: Width constrained (94vw).
          Desktop: Height constrained (60vh), width auto-calculated from aspect ratio.
      */}
      <div className={`
          absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-in-out pointer-events-none
          ${isPlayer2Turn ? 'translate-y-[15vh]' : '-translate-y-[15vh]'}
      `}>
         <div className="
             relative z-10 transition-all duration-500 origin-center
             shadow-2xl rounded-3xl pointer-events-auto
             aspect-[4/3]
             w-[94vw] h-auto
             md:w-auto md:h-[65vh]
             max-w-[95vw]
         ">
             <h1 className={`absolute -top-10 left-0 right-0 text-center text-sm md:text-xl font-bold text-slate-400 tracking-wide uppercase transition-all duration-500 ${isPlayer2Turn ? 'rotate-180 top-auto -bottom-10' : ''}`}>
                Greek Grammar Journey
            </h1>
            
            <div className="w-full h-full overflow-hidden rounded-3xl">
                <GameBoard 
                    players={players} 
                    currentPlayerId={currentPlayerIdx}
                    seed={gameId}
                />
            </div>
         </div>
      </div>

      {/* Control Panel Layer */}
      <div 
        className={`absolute left-0 right-0 z-30 transition-all duration-700 ease-in-out transform flex justify-center
            ${isPlayer2Turn ? 'top-0 rotate-180 items-start' : 'bottom-0 rotate-0 items-end'}
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
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">🎉 Συγχαρητήρια! 🎉</h2>
                <p className="text-lg md:text-xl mb-8 text-slate-600">
                    Победитель: <br/>
                    <span className={`text-2xl md:text-3xl ${winner.id === 0 ? 'text-indigo-600' : 'text-rose-600'} font-bold`}>{winner.name}</span>
                </p>
                <button 
                    onClick={resetGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-full text-lg md:text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    Новая игра
                </button>
             </div>
         </div>
      )}

    </div>
  );
}