import React from 'react';
import { GamePhase, TranslationPair, Player } from '../types';
import { PLAYER_CONFIG } from '../constants';
import { Eye, Check, X, MoveLeft, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  phase: GamePhase;
  currentPlayer: Player;
  currentQuestion: TranslationPair | null;
  onReveal: () => void;
  onGrade: (errors: number) => void;
  onNextTurn: () => void;
  gameWinner: Player | null;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  phase,
  currentPlayer,
  currentQuestion,
  onReveal,
  onGrade,
  onNextTurn,
  gameWinner
}) => {
  const opponent = PLAYER_CONFIG.find(p => p.id !== currentPlayer.id);

  // If winner exists, the parent App.tsx handles the modal now to rotate it correctly.
  // We return null here to avoid rendering the panel underneath.
  if (gameWinner) return null;

  return (
    // Updated container: 
    // - Rounded only on top (which becomes bottom when rotated)
    // - Shadow adjusted to point "up" (which becomes down when rotated)
    <div className="bg-white/95 backdrop-blur shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-200 p-6 rounded-t-[2.5rem] w-full max-w-2xl mx-auto min-h-[320px] flex flex-col justify-start">
      
      {/* Header: Turn Indicator */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
         <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Ход игрока:</span>
            <div className={`px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-sm ${PLAYER_CONFIG[currentPlayer.id].color}`}>
                {PLAYER_CONFIG[currentPlayer.id].name}
            </div>
         </div>
         {phase !== GamePhase.TASK_REVEAL && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                <span>Проверяет: {opponent?.name}</span>
            </div>
         )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        {phase === GamePhase.TASK_REVEAL && (
           <div className="text-center w-full animate-fade-in py-4">
              <button 
                onClick={onNextTurn}
                className={`w-full py-8 rounded-3xl text-2xl font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center gap-4 ${PLAYER_CONFIG[currentPlayer.id].color}`}
              >
                <HelpCircle className="w-14 h-14 opacity-90" />
                <span>Получить задание</span>
              </button>
           </div>
        )}

        {phase === GamePhase.ANSWER_CHECK && currentQuestion && (
            <div className="w-full animate-fade-in">
                {/* The Task Card */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-4 text-center border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                    <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-widest">Переведи на греческий</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                        {currentQuestion.russian}
                    </h3>
                </div>

                {/* Reveal Button */}
                <button 
                    onClick={onReveal}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-lg shadow-slate-300/50 flex items-center justify-center gap-3 transition-colors text-lg"
                >
                    <Eye className="w-6 h-6" />
                    Показать ответ
                </button>
            </div>
        )}

        {phase === GamePhase.MOVEMENT && currentQuestion && (
            <div className="w-full animate-fade-in flex flex-col items-center">
                 {/* The Answer Card */}
                 <div className="grid grid-cols-1 gap-3 w-full mb-4">
                    <div className="bg-green-50 rounded-2xl p-4 text-center border-2 border-green-200 shadow-sm">
                        <p className="text-xs text-green-600 font-bold uppercase mb-1">Правильный ответ</p>
                        <p className="text-2xl font-bold text-green-800 greek-font leading-snug">
                            {currentQuestion.greek}
                        </p>
                    </div>
                 </div>

                 {/* Grading Controls */}
                 <div className="w-full">
                    <p className="text-center text-slate-400 mb-3 text-xs uppercase font-bold tracking-wider">Оценка ответа</p>
                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => onGrade(0)} className="col-span-1 flex flex-col items-center justify-center p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 border-b-4 border-green-300 active:border-b-0 active:translate-y-1 transition-all h-24">
                            <Check className="w-6 h-6 mb-1" />
                            <span className="font-bold text-xs sm:text-sm">Верно</span>
                            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-1">+2</span>
                        </button>
                        <button onClick={() => onGrade(1)} className="col-span-1 flex flex-col items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition-all h-24">
                            <span className="font-bold text-xl mb-1">1</span>
                            <span className="font-bold text-xs sm:text-sm leading-none">Ошиб.</span>
                            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-1">+1</span>
                        </button>
                        <button onClick={() => onGrade(2)} className="col-span-1 flex flex-col items-center justify-center p-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 border-b-4 border-orange-300 active:border-b-0 active:translate-y-1 transition-all h-24">
                            <span className="font-bold text-xl mb-1">2</span>
                            <span className="font-bold text-xs sm:text-sm leading-none">Ошиб.</span>
                            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-1">0</span>
                        </button>
                        <button onClick={() => onGrade(3)} className="col-span-1 flex flex-col items-center justify-center p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 border-b-4 border-red-300 active:border-b-0 active:translate-y-1 transition-all h-24">
                            <MoveLeft className="w-6 h-6 mb-1" />
                            <span className="font-bold text-xs sm:text-sm">3+</span>
                            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-1">-1</span>
                        </button>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};