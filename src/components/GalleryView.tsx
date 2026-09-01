import React, { useState } from 'react';
import { 
  Film, 
  Music, 
  Search, 
  Grid, 
  List, 
  Play, 
  FolderOpen, 
  Trash2, 
  Share2, 
  Download,
  Filter
} from 'lucide-react';
import { DownloadItem, Language } from '../types';
import { translations } from '../utils/translations';

interface GalleryViewProps {
  items: DownloadItem[];
  language: Language;
  onPlayMedia: (item: DownloadItem) => void;
  onOpenFileDetails: (item: DownloadItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenNewDownloadModal: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  language,
  onPlayMedia,
  onOpenFileDetails,
  onDeleteItem,
  onOpenNewDownloadModal,
}) => {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<'all' | 'videos' | 'audio' | '4k'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.arabicTitle && item.arabicTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'videos') return item.type === 'video';
    if (activeCategory === 'audio') return item.type === 'audio';
    if (activeCategory === '4k') return item.quality === '4K';
    return true;
  });

  return (
    <div id="gallery-screen-container" className="space-y-5 pb-28">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="gallery-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#131b2e] border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-white/5 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: t.all, count: items.length },
          { id: 'videos', label: t.videos, count: items.filter((i) => i.type === 'video').length },
          { id: 'audio', label: t.audio, count: items.filter((i) => i.type === 'audio').length },
          { id: '4k', label: t.uhd4k, count: items.filter((i) => i.quality === '4K').length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-[#312e81] text-[#e0e7ff] border border-indigo-500/40 shadow-sm'
                : 'glass-card-subtle text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[10px] opacity-70 bg-black/30 px-1.5 py-0.2 rounded-full">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Items Display */}
      {filteredItems.length === 0 ? (
        <div className="glass-card-subtle rounded-2xl p-12 text-center text-slate-400">
          <Film className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">{t.noDownloadsFound}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item, index) => {
            const formattedSize = item.totalSize >= 1000
              ? `${(item.totalSize / 1000).toFixed(1)} GB`
              : `${item.totalSize} MB`;

            return (
              <div
                key={`gallery-grid-${item.id}-${index}`}
                className="glass-card rounded-2xl p-3 flex flex-col gap-2.5 group hover:border-white/15 transition-all"
              >
                {/* Media preview container */}
                <div className="w-full h-36 rounded-xl bg-[#1c263e] overflow-hidden relative border border-white/5 group/thumb">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c263e] to-[#0f172a]">
                      <Music className="w-10 h-10 text-indigo-400" />
                    </div>
                  )}

                  {/* Arabic badge overlay */}
                  {item.arabicTitle && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded border border-white/10">
                      {item.arabicTitle}
                    </div>
                  )}

                  {/* Quality Badge */}
                  <div className="absolute top-2 right-2 bg-[#171f33]/85 backdrop-blur-md text-slate-200 font-bold text-[10px] px-1.5 py-0.5 rounded border border-white/10">
                    {item.quality}
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlayMedia(item)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-3 backdrop-blur-md shadow-lg transform active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </button>
                  </div>
                </div>

                {/* Details and action row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4
                      className="text-xs font-semibold text-slate-100 truncate hover:text-indigo-300 transition-colors cursor-pointer"
                      onClick={() => onOpenFileDetails(item)}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formattedSize} • {item.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenFileDetails(item)}
                      className="p-1.5 text-slate-400 hover:text-indigo-300 rounded-lg hover:bg-white/5 cursor-pointer"
                      title={t.fileDetails}
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 cursor-pointer"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredItems.map((item, index) => (
            <div
              key={`gallery-list-${item.id}-${index}`}
              className="glass-card rounded-xl p-3 flex items-center justify-between gap-3 group hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-14 h-14 rounded-lg bg-[#1c263e] overflow-hidden shrink-0 relative cursor-pointer flex items-center justify-center border border-white/5"
                  onClick={() => onPlayMedia(item)}
                >
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-6 h-6 text-indigo-400" />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-100 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.quality} • {item.totalSize} MB • {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onPlayMedia(item)}
                  className="p-2 text-indigo-400 hover:bg-[#312e81]/60 rounded-full cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-indigo-400" />
                </button>
                <button
                  onClick={() => onOpenFileDetails(item)}
                  className="p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-white/5 cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-full hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
