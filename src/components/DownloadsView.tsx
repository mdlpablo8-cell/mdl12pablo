import React from 'react';
import { 
  Pause, 
  Play, 
  X, 
  FolderOpen, 
  Film, 
  Music, 
  RotateCw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Share2
} from 'lucide-react';
import { DownloadItem, Language } from '../types';
import { translations } from '../utils/translations';

interface DownloadsViewProps {
  activeTransfers: DownloadItem[];
  completedItems: DownloadItem[];
  language: Language;
  onTogglePause: (id: string) => void;
  onCancelTransfer: (id: string) => void;
  onClearCompleted: () => void;
  onPlayMedia: (item: DownloadItem) => void;
  onOpenFileDetails: (item: DownloadItem) => void;
  onNavigateToGallery: () => void;
  onOpenNewDownloadModal: () => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  activeTransfers,
  completedItems,
  language,
  onTogglePause,
  onCancelTransfer,
  onClearCompleted,
  onPlayMedia,
  onOpenFileDetails,
  onNavigateToGallery,
  onOpenNewDownloadModal,
}) => {
  const t = translations[language];

  return (
    <div id="downloads-screen-container" className="space-y-7 pb-28">
      {/* 1. Active Transfers Section */}
      <section id="section-active-transfers" aria-label={t.activeTransfers}>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>{t.activeTransfers}</span>
          </h2>
          <span
            id="badge-active-count"
            className="text-xs font-semibold bg-[#312e81] text-[#e0e7ff] px-2.5 py-1 rounded-full shadow-sm"
          >
            {activeTransfers.length} {language === 'ar' ? 'عناصر' : 'items'}
          </span>
        </div>

        {activeTransfers.length === 0 ? (
          <div className="glass-card-subtle rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">{t.noActiveTransfers}</p>
            <button
              onClick={onOpenNewDownloadModal}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>+</span>
              <span>{t.newDownload}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {activeTransfers.map((item, index) => {
              const isPaused = item.status === 'paused';
              const formattedCurrent = (item.currentSize >= 1000)
                ? `${(item.currentSize / 1000).toFixed(1)} GB`
                : `${Math.round(item.currentSize)} MB`;
              const formattedTotal = (item.totalSize >= 1000)
                ? `${(item.totalSize / 1000).toFixed(1)} GB`
                : `${Math.round(item.totalSize)} MB`;

              return (
                <div
                  key={`transfer-${item.id}-${index}`}
                  id={`transfer-item-${item.id}`}
                  className="glass-card rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)] relative overflow-hidden group transition-all hover:border-white/15"
                >
                  {/* Subtle hover backlight */}
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex gap-4 items-center">
                    {/* Thumbnail / Media Icon */}
                    <div className="w-24 h-16 rounded-xl bg-[#1c263e] overflow-hidden relative shrink-0 flex items-center justify-center border border-white/5">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Music className="w-7 h-7 text-indigo-400" />
                        </div>
                      )}

                      {/* Quality Badge (4K / HQ / etc) */}
                      <div className="absolute top-1.5 left-1.5 bg-[#171f33]/85 backdrop-blur-md text-slate-200 font-bold text-[10px] px-1.5 py-0.5 rounded border border-white/10">
                        {item.quality}
                      </div>

                      {isPaused && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            {t.pause}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content & Progress */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className="text-sm font-semibold text-slate-100 truncate"
                          title={item.title}
                        >
                          {item.title}
                        </h3>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            id={`btn-pause-${item.id}`}
                            onClick={() => onTogglePause(item.id)}
                            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            title={isPaused ? t.resume : t.pause}
                            aria-label={isPaused ? t.resume : t.pause}
                          >
                            {isPaused ? (
                              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                            ) : (
                              <Pause className="w-4 h-4 fill-slate-400" />
                            )}
                          </button>

                          <button
                            id={`btn-cancel-${item.id}`}
                            onClick={() => onCancelTransfer(item.id)}
                            className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            title={t.cancel}
                            aria-label={t.cancel}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stats & Progress Bar */}
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-xs text-slate-400 font-medium">
                          <span>
                            {Math.round(item.progress)}% • {formattedCurrent} / {formattedTotal}
                          </span>
                          <span
                            className={
                              isPaused
                                ? 'text-amber-400 font-semibold'
                                : 'text-indigo-400 font-semibold'
                            }
                          >
                            {isPaused ? (language === 'ar' ? 'موقوف' : 'Paused') : `${item.speed.toFixed(1)} MB/s`}
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="h-1.5 w-full bg-[#222c47] rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isPaused ? 'bg-amber-500' : 'progress-gradient'
                            }`}
                            style={{ width: `${Math.max(2, Math.min(100, item.progress))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Recently Completed Section */}
      <section id="section-recently-completed" className="mt-8" aria-label={t.recentlyCompleted}>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {t.recentlyCompleted}
          </h2>
          {completedItems.length > 0 && (
            <button
              id="btn-clear-all"
              onClick={onClearCompleted}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors cursor-pointer"
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {completedItems.length === 0 ? (
          <div className="glass-card-subtle rounded-2xl p-8 text-center text-slate-400">
            <p className="text-sm">{t.noDownloadsFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedItems.map((item, index) => {
              const formattedSize = item.totalSize >= 1000
                ? `${(item.totalSize / 1000).toFixed(1)} GB`
                : `${item.totalSize} MB`;

              return (
                <div
                  key={`completed-${item.id}-${index}`}
                  id={`completed-item-${item.id}`}
                  className="glass-card rounded-2xl p-3.5 flex flex-col gap-3 group transition-all duration-200 hover:border-white/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                >
                  {/* Thumbnail with 16:9 ratio and Play Overlay */}
                  <div className="w-full h-36 rounded-xl bg-[#1c263e] overflow-hidden relative border border-white/5 group/thumb">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c263e] to-[#0f172a]">
                        <Music className="w-12 h-12 text-indigo-400/80" />
                      </div>
                    )}

                    {/* Arabic Title overlay badge if present (as in Nature Doc: "سلسلة الجبال الضبابية") */}
                    {item.arabicTitle && (
                      <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10 shadow-sm pointer-events-none">
                        {item.arabicTitle}
                      </div>
                    )}

                    {/* Quality badge bottom-right */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#171f33]/85 backdrop-blur-md text-slate-200 font-bold text-[10px] px-2 py-0.5 rounded border border-white/10">
                      {item.quality}
                    </div>

                    {/* Hover Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`btn-play-${item.id}`}
                        onClick={() => onPlayMedia(item)}
                        className="bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-full p-3.5 backdrop-blur-md shadow-lg transform active:scale-95 transition-all cursor-pointer"
                        title={t.play}
                        aria-label={t.play}
                      >
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata and Open Details Button */}
                  <div className="flex justify-between items-start gap-2 pt-0.5">
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-sm font-semibold text-slate-100 truncate cursor-pointer hover:text-indigo-300 transition-colors"
                        onClick={() => onOpenFileDetails(item)}
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>{formattedSize}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </p>
                    </div>

                    <button
                      id={`btn-folder-${item.id}`}
                      onClick={() => onOpenFileDetails(item)}
                      className="text-indigo-400 p-2 bg-[#312e81]/60 hover:bg-[#312e81] rounded-full transition-all active:scale-95 cursor-pointer shrink-0"
                      title={t.openFile}
                      aria-label={t.openFile}
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All in Gallery Button matching the design */}
        <div className="mt-6 flex justify-center">
          <button
            id="btn-view-all-gallery"
            onClick={onNavigateToGallery}
            className="px-6 py-3 border-[1.5px] border-slate-600 text-slate-200 text-xs font-semibold rounded-full hover:bg-[#171f33] hover:border-slate-500 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Film className="w-4 h-4 text-indigo-400" />
            <span>{t.viewAllInGallery}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
