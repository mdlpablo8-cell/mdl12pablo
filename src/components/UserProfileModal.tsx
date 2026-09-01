import React from 'react';
import { X, CircleUser, HardDrive, ShieldCheck, Zap, Download, Award, Clock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  completedCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  completedCount,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/15 relative overflow-hidden space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300">
              <CircleUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{t.userProfile}</h3>
              <p className="text-xs text-slate-400">MDL Unlimited Pro Member</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#131b2e] rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-100">Media Pro User</h4>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">ID: MDL-8842-X</p>
          </div>
        </div>

        {/* Storage Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>{t.storageUsed}</span>
            <span className="text-indigo-400">3.38 GB / 64 GB</span>
          </div>

          {/* Segmented multi-color storage bar */}
          <div className="h-2.5 w-full bg-[#222c47] rounded-full overflow-hidden flex">
            <div className="h-full bg-indigo-500 w-[60%]" title="Videos: 2.9 GB" />
            <div className="h-full bg-cyan-400 w-[15%]" title="Audio: 360 MB" />
            <div className="h-full bg-amber-400 w-[5%]" title="Other: 120 MB" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              {t.videos} (2.9 GB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              {t.audio} (360 MB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
              {language === 'ar' ? 'مساحة خالية' : 'Free'} (60.6 GB)
            </span>
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-[#131b2e] rounded-xl border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">
              {language === 'ar' ? 'إجمالي التنزيلات' : 'Total Downloads'}
            </span>
            <span className="text-lg font-bold text-slate-100 mt-0.5 block font-mono">
              {completedCount + 18}
            </span>
          </div>
          <div className="p-3 bg-[#131b2e] rounded-xl border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">
              {language === 'ar' ? 'البيانات المحفوظة' : 'Bandwidth Saved'}
            </span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block font-mono">
              18.4 GB
            </span>
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
