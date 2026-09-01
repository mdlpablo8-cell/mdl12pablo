export type MediaType = 'video' | 'audio' | 'image' | 'archive' | 'document';

export type QualityTag = '4K' | '1080p' | '720p' | '480p' | 'HQ' | '320k' | 'FLAC' | 'HD';

export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'failed' | 'queued';

export interface DownloadItem {
  id: string;
  title: string;
  arabicTitle?: string;
  type: MediaType;
  quality: QualityTag;
  status: DownloadStatus;
  progress: number; // 0 - 100
  currentSize: number; // in MB
  totalSize: number; // in MB
  speed: number; // in MB/s
  thumbnail: string;
  mediaUrl?: string;
  date: string;
  completedAt?: string;
  category: 'videos' | 'audio' | 'images' | 'other';
  duration?: string;
  threads?: number;
  codec?: string;
  bitrate?: string;
  resolution?: string;
  sourceUrl?: string;
}

export type TabType = 'home' | 'downloads' | 'gallery' | 'settings';

export type Language = 'en' | 'ar';

export type ThemeMode = 'dark' | 'amoled' | 'blue' | 'light';

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  maxConcurrent: number;
  maxSpeedMBps: number; // 0 = unlimited
  turboThreads: number;
  downloadPath: string;
  autoResume: boolean;
  wifiOnly: boolean;
  notificationSound: boolean;
  autoExtractArchive: boolean;
}
