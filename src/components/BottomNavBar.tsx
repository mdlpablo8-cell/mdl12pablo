import React from 'react';
import { Home, Download, Film, Settings } from 'lucide-react';
import { TabType, Language } from '../types';
import { translations } from '../utils/translations';

interface BottomNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  activeCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  language,
  activeCount,
}) => {
  const t = translations[language];

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: t.home,
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'downloads',
      label: t.downloads,
      icon: (
        <div className="relative">
          <Download className="w-5 h-5" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {activeCount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'gallery',
      label: t.gallery,
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.settings,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1326]/90 backdrop-blur-xl border-t border-white/8 shadow-[0_-8px_24px_rgba(0,0,0,0.4)] px-4 pt-2 pb-6 max-w-4xl mx-auto flex justify-around items-center rounded-t-2xl transition-all"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all duration-200 active:scale-90 cursor-pointer min-w-[72px] ${
              isActive
                ? 'bg-[#312e81] text-[#e0e7ff] font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#171f33]/60'
            }`}
          >
            <span className="flex items-center justify-center">{tab.icon}</span>
            <span className="text-[11px] mt-1 font-medium tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
