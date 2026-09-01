import React, { useState, useEffect } from 'react';
import { X, Gauge, Zap, Activity, ShieldCheck, Wifi, Cpu, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface SpeedBoosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  totalSpeed: number;
}

export const SpeedBoosterModal: React.FC<SpeedBoosterModalProps> = ({
  isOpen,
  onClose,
  language,
  totalSpeed,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [turboActive, setTurboActive] = useState(true);
  const [ping, setPing] = useState(14);
  const [threadCount, setThreadCount] = useState(8);
  const [activeSpeed, setActiveSpeed] = useState(totalSpeed > 0 ? totalSpeed : 16.5);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small realistic speed fluctuations
      setActiveSpeed((prev) => {
        const delta = (Math.random() - 0.5) * 1.2;
        return Math.max(8.0, Number((prev + delta).toFixed(1)));
      });
      setPing(Math.floor(12 + Math.random() * 6));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/15 relative overflow-hidden space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{t.speedBooster}</h3>
              <p className="text-xs text-slate-400">MDL Turbo Multi-Stream Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Dial / Hero Metric */}
        <div className="text-center py-4 bg-[#131b2e] rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {language === 'ar' ? 'سرعة التنزيل الكلية' : 'Current Aggregate Speed'}
          </div>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 mt-1 font-mono">
            {activeSpeed} <span className="text-base font-normal text-slate-400">MB/s</span>
          </div>

          {/* Mini Real-Time Bars */}
          <div className="flex items-end justify-center gap-1.5 h-12 mt-3 px-6">
            {[40, 65, 80, 55, 90, 75, 85, 95, 70, 88, 92, 100].map((h, i) => (
              <div
                key={i}
                className="w-2.5 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm transition-all duration-300"
                style={{ height: `${h * (activeSpeed / 20)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Turbo Acceleration Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                {language === 'ar' ? 'وضع التوربو فائق السرعة' : 'Turbo Multi-Chunk Engine'}
              </span>
              <span className="text-[11px] text-indigo-300">
                {threadCount}x parallel download streams
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={turboActive}
              onChange={(e) => setTurboActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Network Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold">Latency</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{ping} ms</span>
          </div>
          <div className="p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold">Threads</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">{threadCount} / 16</span>
          </div>
          <div className="p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold">Protocol</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">HTTP/3 QUIC</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
