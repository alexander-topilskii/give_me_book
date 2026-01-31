import React from 'react';
import { GameMode } from '../types';

interface ModeSelectProps {
  onSelectMode: (mode: GameMode) => void;
}

const modes = [
  {
    mode: GameMode.GRAMMAR,
    title: 'Фразы с книгой',
    description: 'Переведи русскую фразу на греческий.',
    className: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200'
  },
  {
    mode: GameMode.CODE,
    title: 'Цифры и буквы',
    description: 'Собери код по греческой подсказке.',
    className: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
  }
];

export const ModeSelect: React.FC<ModeSelectProps> = ({ onSelectMode }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl p-4 md:p-8">
        <h2 className="text-center text-lg md:text-2xl font-bold text-slate-700 mb-4 md:mb-6">
          Выбери режим игры
        </h2>
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {modes.map((item) => (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`w-full text-left text-white rounded-2xl p-4 md:p-6 shadow-xl transition-transform hover:scale-[1.01] active:scale-95 ${item.className}`}
            >
              <div className="text-base md:text-xl font-bold">{item.title}</div>
              <div className="text-xs md:text-sm opacity-90 mt-1">{item.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
