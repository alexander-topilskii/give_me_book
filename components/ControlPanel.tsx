import React, { useState, useEffect } from 'react';
import { GamePhase, GameTask, Player } from '../types';
import { PLAYER_CONFIG } from '../constants';
import { Eye, Check, MoveLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlPanelProps {
  phase: GamePhase;
  currentPlayer: Player;
  currentQuestion: GameTask | null;
  onGrade: (errors: number) => void;
  gameWinner: Player | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  phase,
  currentPlayer,
  currentQuestion,
  onGrade,
  gameWinner
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const opponent = PLAYER_CONFIG.find(p => p.id !== currentPlayer.id);

  // Auto-expand when phase changes or new question arrives (important for UX)
  useEffect(() => {
    setIsMinimized(false);
  }, [phase, currentQuestion]);

  if (gameWinner) return null;

  return (
    // The container adapts its height based on content. Minimized = smaller.
    <div className={`
        bg-white/95 backdrop-blur shadow-[0_-8px_30px_rgba(0,0,0,0.12)] 
        border-t border-slate-200 
        rounded-t-[1.5rem] md:rounded-t-[2.5rem] 
        w-full max-w-2xl mx-auto 
        flex flex-col justify-start
        transition-all duration-300 ease-in-out
        ${isMinimized ? 'pb-2' : 'p-3 md:p-6'}
    `}>
      
      {/* Header: Turn Indicator & Minimize Toggle */}
      <div 
        className="flex justify-between items-center px-4 py-2 border-b border-slate-100 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
         <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Ход игрока:</span>
            <div className={`px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-white font-bold text-xs md:text-sm shadow-sm ${PLAYER_CONFIG[currentPlayer.id].color}`}>
                {PLAYER_CONFIG[currentPlayer.id].name}
            </div>
         </div>
         
         <div className="flex items-center gap-2">
            {currentQuestion && (
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 md:px-3 rounded-full">
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Проверяет:</span>
                    <span>{opponent?.name}</span>
                </div>
            )}
            {/* Toggle Button */}
            <div className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
         </div>
      </div>

      {/* Collapsible Content Body */}
      <div className={`
          flex-1 flex flex-col items-center justify-center w-full overflow-hidden transition-all duration-300
          ${isMinimized ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 pt-2 md:pt-4'}
      `}>
        
        {phase === GamePhase.MOVEMENT && currentQuestion && (
            <div className="w-full animate-fade-in flex flex-col items-center">
                 {/* The Answer Card */}
                 <div className="grid grid-cols-1 gap-2 md:gap-3 w-full mb-2 md:mb-4">
                    <div className="bg-green-50 rounded-lg md:rounded-2xl p-2 md:p-4 text-center border-2 border-green-200 shadow-sm">
                        <p className="text-[9px] md:text-xs text-green-600 font-bold uppercase mb-0.5 md:mb-1">Правильный ответ</p>
                        <p className="text-base md:text-2xl font-bold text-green-800 greek-font leading-snug">
                            {currentQuestion.answer}
                        </p>
                        <p className="mt-1 md:mt-2 text-[10px] md:text-sm text-slate-500 font-semibold">
                            {currentQuestion.prompt}
                        </p>
                    </div>
                 </div>

                 {/* Grading Controls */}
                 <div className="w-full">
                    <p className="text-center text-slate-400 mb-1 md:mb-3 text-[9px] md:text-xs uppercase font-bold tracking-wider">Оценка ответа</p>
                    <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onGrade(0); }} className="col-span-1 flex flex-col items-center justify-center p-1 md:p-2 bg-green-100 text-green-700 rounded-lg md:rounded-xl hover:bg-green-200 border-b-2 md:border-b-4 border-green-300 active:border-b-0 active:translate-y-1 transition-all h-14 md:h-24">
                            <Check className="w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1" />
                            <span className="font-bold text-[9px] md:text-sm">Верно</span>
                            <span className="text-[8px] md:text-[10px] font-bold bg-white/50 px-1.5 py-0.5 rounded-full mt-0.5 md:mt-1">+2</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onGrade(1); }} className="col-span-1 flex flex-col items-center justify-center p-1 md:p-2 bg-blue-100 text-blue-700 rounded-lg md:rounded-xl hover:bg-blue-200 border-b-2 md:border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition-all h-14 md:h-24">
                            <span className="font-bold text-sm md:text-xl mb-0.5 md:mb-1">1</span>
                            <span className="font-bold text-[9px] md:text-sm leading-none">Ошиб.</span>
                            <span className="text-[8px] md:text-[10px] font-bold bg-white/50 px-1.5 py-0.5 rounded-full mt-0.5 md:mt-1">+1</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onGrade(2); }} className="col-span-1 flex flex-col items-center justify-center p-1 md:p-2 bg-orange-100 text-orange-700 rounded-lg md:rounded-xl hover:bg-orange-200 border-b-2 md:border-b-4 border-orange-300 active:border-b-0 active:translate-y-1 transition-all h-14 md:h-24">
                            <span className="font-bold text-sm md:text-xl mb-0.5 md:mb-1">2</span>
                            <span className="font-bold text-[9px] md:text-sm leading-none">Ошиб.</span>
                            <span className="text-[8px] md:text-[10px] font-bold bg-white/50 px-1.5 py-0.5 rounded-full mt-0.5 md:mt-1">0</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onGrade(3); }} className="col-span-1 flex flex-col items-center justify-center p-1 md:p-2 bg-red-100 text-red-700 rounded-lg md:rounded-xl hover:bg-red-200 border-b-2 md:border-b-4 border-red-300 active:border-b-0 active:translate-y-1 transition-all h-14 md:h-24">
                            <MoveLeft className="w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1" />
                            <span className="font-bold text-[9px] md:text-sm">3+</span>
                            <span className="text-[8px] md:text-[10px] font-bold bg-white/50 px-1.5 py-0.5 rounded-full mt-0.5 md:mt-1">-1</span>
                        </button>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};