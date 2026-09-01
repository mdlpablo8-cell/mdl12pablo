import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Download, AlertCircle } from 'lucide-react';
import { 
  DownloadItem, 
  TabType, 
  Language, 
  AppSettings, 
  QualityTag, 
  MediaType 
} from './types';
import { 
  INITIAL_ACTIVE_TRANSFERS, 
  INITIAL_COMPLETED_ITEMS, 
  INITIAL_SETTINGS 
} from './data/initialData';
import { translations } from './utils/translations';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DownloadsView } from './components/DownloadsView';
import { HomeView } from './components/HomeView';
import { GalleryView } from './components/GalleryView';
import { SettingsView } from './components/SettingsView';
import { NewDownloadModal } from './components/NewDownloadModal';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { FileDetailsModal } from './components/FileDetailsModal';
import { SpeedBoosterModal } from './components/SpeedBoosterModal';
import { UserProfileModal } from './components/UserProfileModal';

// Deduplicate array of items by ID
function deduplicateItems(items: DownloadItem[]): DownloadItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export default function App() {
  // App settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('mdl_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_SETTINGS;
  });

  // Navigation tab state (default to 'downloads' to showcase the active transfers screen)
  const [currentTab, setCurrentTab] = useState<TabType>('downloads');

  // Active & Completed downloads with unique keys guarantee
  const [activeTransfers, setActiveTransfers] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('mdl_active_transfers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicateItems(parsed);
        }
      } catch (e) { }
    }
    return deduplicateItems(INITIAL_ACTIVE_TRANSFERS);
  });

  const [completedItems, setCompletedItems] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('mdl_completed_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicateItems(parsed);
        }
      } catch (e) { }
    }
    return deduplicateItems(INITIAL_COMPLETED_ITEMS);
  });

  // Modals state
  const [isNewDownloadModalOpen, setIsNewDownloadModalOpen] = useState(false);
  const [isSpeedBoosterOpen, setIsSpeedBoosterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMediaForPlay, setSelectedMediaForPlay] = useState<DownloadItem | null>(null);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<DownloadItem | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mdl_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mdl_active_transfers', JSON.stringify(activeTransfers));
  }, [activeTransfers]);

  useEffect(() => {
    localStorage.setItem('mdl_completed_items', JSON.stringify(completedItems));
  }, [completedItems]);

  // Active Download Simulation Engine: pure updater without nested side-effects
  useEffect(() => {
    const interval = setInterval(() => {
      let newlyFinished: DownloadItem[] = [];

      setActiveTransfers((prevTransfers) => {
        const remaining: DownloadItem[] = [];

        for (const item of prevTransfers) {
          if (item.status !== 'downloading') {
            remaining.push(item);
            continue;
          }

          // Increment progress based on speed and file size
          const speedFactor = (item.speed || 8) / 10;
          const progressDelta = (speedFactor / (item.totalSize / 100)) * 1.5;
          const nextProgress = Math.min(100, item.progress + Math.max(0.4, progressDelta));
          const nextCurrentSize = (nextProgress / 100) * item.totalSize;

          // Speed fluctuation
          const speedFluctuation = item.speed + (Math.random() - 0.48) * 0.8;
          const nextSpeed = Math.max(2.0, Math.min(28.0, Number(speedFluctuation.toFixed(1))));

          if (nextProgress >= 100) {
            newlyFinished.push({
              ...item,
              id: `done-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              status: 'completed',
              progress: 100,
              currentSize: item.totalSize,
              speed: 0,
              date: 'Just now',
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          } else {
            remaining.push({
              ...item,
              progress: nextProgress,
              currentSize: nextCurrentSize,
              speed: nextSpeed,
            });
          }
        }

        return remaining;
      });

      // Handle completed items outside the pure state updater
      if (newlyFinished.length > 0) {
        setCompletedItems((prev) => {
          const combined = [...newlyFinished, ...prev];
          return deduplicateItems(combined);
        });

        const completedTitle = newlyFinished[0].title;
        showToast(
          settings.language === 'ar'
            ? `اكتمل تحميل: ${completedTitle}`
            : `Download completed: ${completedTitle}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.language]);

  // Handler: Toggle Pause / Resume
  const handleTogglePause = (id: string) => {
    setActiveTransfers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'paused' ? 'downloading' : 'paused';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Handler: Cancel transfer
  const handleCancelTransfer = (id: string) => {
    setActiveTransfers((prev) => prev.filter((item) => item.id !== id));
    showToast(settings.language === 'ar' ? 'تم إلغاء التنزيل' : 'Transfer cancelled');
  };

  // Handler: Clear all completed
  const handleClearCompleted = () => {
    if (window.confirm(translations[settings.language].clearConfirm)) {
      setCompletedItems([]);
      showToast(settings.language === 'ar' ? 'تم مسح السجل' : 'Completed list cleared');
    }
  };

  // Handler: Delete single item
  const handleDeleteItem = (id: string) => {
    setCompletedItems((prev) => prev.filter((i) => i.id !== id));
    showToast(settings.language === 'ar' ? 'تم حذف الملف' : 'Item deleted');
  };

  // Handler: Start a new download
  const handleStartDownload = (params: {
    url: string;
    title: string;
    quality: QualityTag;
    type: MediaType;
    thumbnail?: string;
    sizeMB: number;
    codec?: string;
    duration?: string;
  }) => {
    const newItem: DownloadItem = {
      id: `transfer-${Date.now()}`,
      title: params.title,
      type: params.type,
      quality: params.quality,
      status: 'downloading',
      progress: 0,
      currentSize: 0,
      totalSize: params.sizeMB,
      speed: Number((8 + Math.random() * 8).toFixed(1)),
      thumbnail: params.thumbnail || '',
      date: 'Today',
      category: params.type === 'video' ? 'videos' : params.type === 'audio' ? 'audio' : 'other',
      threads: settings.turboThreads || 8,
      sourceUrl: params.url,
      duration: params.duration || (params.type === 'video' ? '05:20' : '03:45'),
      codec: params.codec || (params.type === 'video' ? 'H.264 / AAC High (Combined Stream)' : 'MPEG-3 Stereo'),
      resolution: params.quality === '4K' ? '3840x2160' : params.quality === '1080p' ? '1920x1080' : 'Audio Stereo',
    };

    setActiveTransfers((prev) => [newItem, ...prev]);
    showToast(translations[settings.language].downloadStarted);
  };

  // Handler: Update settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Handler: Clear cache
  const handleClearCache = () => {
    // simulated cache purge
  };

  const totalSpeed = activeTransfers.reduce(
    (acc, cur) => (cur.status === 'downloading' ? acc + cur.speed : acc),
    0
  );

  const isRtl = settings.language === 'ar';

  return (
    <div
      id="app-root"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0b1326] text-[#e2e8f0] font-sans antialiased selection:bg-indigo-600 selection:text-white pb-10"
    >
      {/* 1. Top App Bar */}
      <TopAppBar
        language={settings.language}
        onOpenSpeedBooster={() => setIsSpeedBoosterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeCount={activeTransfers.length}
      />

      {/* 2. Main Content Container */}
      <main className="pt-20 px-5 max-w-4xl mx-auto">
        {currentTab === 'downloads' && (
          <DownloadsView
            activeTransfers={activeTransfers}
            completedItems={completedItems}
            language={settings.language}
            onTogglePause={handleTogglePause}
            onCancelTransfer={handleCancelTransfer}
            onClearCompleted={handleClearCompleted}
            onPlayMedia={(item) => setSelectedMediaForPlay(item)}
            onOpenFileDetails={(item) => setSelectedFileForDetails(item)}
            onNavigateToGallery={() => setCurrentTab('gallery')}
            onOpenNewDownloadModal={() => setIsNewDownloadModalOpen(true)}
          />
        )}

        {currentTab === 'home' && (
          <HomeView
            language={settings.language}
            onStartDownload={handleStartDownload}
            onNavigateToDownloads={() => setCurrentTab('downloads')}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            items={completedItems}
            language={settings.language}
            onPlayMedia={(item) => setSelectedMediaForPlay(item)}
            onOpenFileDetails={(item) => setSelectedFileForDetails(item)}
            onDeleteItem={handleDeleteItem}
            onOpenNewDownloadModal={() => setIsNewDownloadModalOpen(true)}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClearCache={handleClearCache}
            onToast={showToast}
          />
        )}
      </main>

      {/* 3. Floating Action Button (FAB) for New Download */}
      <button
        id="fab-new-download"
        onClick={() => setIsNewDownloadModalOpen(true)}
        className="fixed bottom-24 right-5 md:right-auto md:left-[calc(50%+260px)] w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_8px_25px_rgba(79,70,229,0.5)] flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all z-40 cursor-pointer border border-white/20"
        title={translations[settings.language].newDownload}
        aria-label={translations[settings.language].newDownload}
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* 4. Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        language={settings.language}
        activeCount={activeTransfers.length}
      />

      {/* 5. Modals & Overlays */}
      <NewDownloadModal
        isOpen={isNewDownloadModalOpen}
        onClose={() => setIsNewDownloadModalOpen(false)}
        language={settings.language}
        onStartDownload={handleStartDownload}
      />

      <MediaPlayerModal
        item={selectedMediaForPlay}
        isOpen={!!selectedMediaForPlay}
        onClose={() => setSelectedMediaForPlay(null)}
        language={settings.language}
      />

      <FileDetailsModal
        item={selectedFileForDetails}
        isOpen={!!selectedFileForDetails}
        onClose={() => setSelectedFileForDetails(null)}
        language={settings.language}
        onPlayMedia={(item) => setSelectedMediaForPlay(item)}
        onDeleteItem={handleDeleteItem}
        onToast={showToast}
      />

      <SpeedBoosterModal
        isOpen={isSpeedBoosterOpen}
        onClose={() => setIsSpeedBoosterOpen(false)}
        language={settings.language}
        totalSpeed={totalSpeed}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={settings.language}
        completedCount={completedItems.length}
      />

      {/* 6. Global Floating Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1e293b]/95 border border-indigo-500/40 backdrop-blur-md shadow-2xl text-xs font-semibold text-slate-100 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
