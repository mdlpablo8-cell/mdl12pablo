import React from 'react';
import { Gauge, CircleUser, Zap, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface TopAppBarProps {
  language: Language;
  onOpenSpeedBooster: () => void;
  onOpenProfile: () => void;
  activeCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  language,
  onOpenSpeedBooster,
  onOpenProfile,
  activeCount,
}) => {
  const t = translations[language];

  return (
    <header
      id="top-app-bar"
      className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0b1326]/85 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 max-w-4xl mx-auto transition-all"
    >
      {/* Speedometer / Turbo Booster Button */}
      <button
        id="btn-speed-booster"
        onClick={onOpenSpeedBooster}
        className="relative group p-2 rounded-full text-indigo-400 hover:text-indigo-300 hover:bg-[#171f33] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title={t.speedBooster}
        aria-label={t.speedBooster}
      >
        <Gauge className="w-6 h-6 stroke-[2.2] transition-transform group-hover:rotate-12" />
        {/* Pulsing indicator when active downloads exist */}
        {activeCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
        )}
      </button>

      {/* Center Brand Title */}
      <div className="flex items-center gap-2">
        <h1
          id="app-main-title"
          className="font-extrabold text-2xl tracking-tight text-slate-100 flex items-center gap-1.5"
        >
          <span>MDL</span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
            PRO
          </span>
        </h1>
      </div>

      {/* User Account / Storage Button */}
      <button
        id="btn-user-profile"
        onClick={onOpenProfile}
        className="p-2 rounded-full text-indigo-400 hover:text-indigo-300 hover:bg-[#171f33] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title={t.userProfile}
        aria-label={t.userProfile}
      >
        <CircleUser className="w-6 h-6 stroke-[2]" />
      </button>
    </header>
  );
};
