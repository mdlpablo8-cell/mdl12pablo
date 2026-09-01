import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Play, 
  Share2, 
  Trash2, 
  Copy, 
  Check, 
  Film, 
  Music, 
  HardDrive, 
  Cpu, 
  Layers, 
  Globe,
  Cloud,
  Volume2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DownloadItem, Language } from '../types';
import { translations } from '../utils/translations';
import { getSavedDriveSession, connectGoogleDrive, uploadFileToGoogleDrive } from '../utils/googleDrive';

interface FileDetailsModalProps {
  item: DownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onPlayMedia: (item: DownloadItem) => void;
  onDeleteItem: (id: string) => void;
  onToast: (msg: string) => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  language,
  onPlayMedia,
  onDeleteItem,
  onToast,
}) => {
  if (!isOpen || !item) return null;

  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveFileUrl, setDriveFileUrl] = useState<string | null>(null);

  const localPath = `/storage/emulated/0/MDL_Downloads/${item.title}`;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(localPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDrive = async () => {
    try {
      setIsSavingToDrive(true);
      let session = getSavedDriveSession();
      if (!session) {
        session = await connectGoogleDrive();
      }

      const mime = item.type === 'video' ? 'video/mp4' : 'audio/mp3';
      const result = await uploadFileToGoogleDrive(
        session.accessToken,
        item.title,
        mime,
        item.totalSize,
        item.sourceUrl
      );

      if (result.webViewLink) {
        setDriveFileUrl(result.webViewLink);
      }
      onToast(t.savedToDriveSuccess);
    } catch (err: any) {
      console.error(err);
      onToast(language === 'ar' ? 'فشل الحفظ في جوجل درايف' : 'Failed to save to Google Drive');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const formattedSize = item.totalSize >= 1000
    ? `${(item.totalSize / 1000).toFixed(2)} GB (${item.totalSize} MB)`
    : `${item.totalSize} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/15 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-100 truncate">{t.fileDetails}</h3>
              <p className="text-xs text-slate-400 truncate">{item.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail preview */}
        <div className="mt-4 w-full h-32 rounded-xl bg-[#1c263e] overflow-hidden relative border border-white/5 flex items-center justify-center">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <Music className="w-10 h-10 text-indigo-400" />
          )}
          <div className="absolute top-2 right-2 bg-[#171f33]/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>{item.quality}</span>
          </div>
          {item.arabicTitle && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded border border-white/10">
              {item.arabicTitle}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="mt-4 space-y-2.5 text-xs">
          {/* Combined Stream Audio Indicator */}
          <div className="flex items-center justify-between p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-300">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{t.combinedStreamAudio}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono">AAC 320k</span>
          </div>

          <div className="flex justify-between p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-slate-400">{t.fileSize}</span>
            <span className="text-slate-100 font-semibold">{formattedSize}</span>
          </div>

          <div className="flex justify-between p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-slate-400">{t.resolution}</span>
            <span className="text-slate-100 font-semibold">{item.resolution || (item.quality === '4K' ? '3840x2160 UHD (Combined)' : '1920x1080 FHD')}</span>
          </div>

          <div className="flex justify-between p-2.5 bg-[#131b2e] rounded-xl border border-white/5">
            <span className="text-slate-400">{t.codec}</span>
            <span className="text-slate-100 font-semibold">{item.codec || 'H.264 / AAC High Muxed'}</span>
          </div>

          {/* Local Path */}
          <div className="p-2.5 bg-[#131b2e] rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{language === 'ar' ? 'مسار الملف على القرص' : 'Local Disk Path'}</span>
              <button
                onClick={handleCopyPath}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>
            <p className="font-mono text-[11px] text-slate-300 break-all">{localPath}</p>
          </div>
        </div>

        {/* Actions Footer with Google Drive */}
        <div className="mt-5 space-y-2">
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                onPlayMedia(item);
                onClose();
              }}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.play}</span>
            </button>

            <button
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className="flex-1 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Cloud className="w-4 h-4" />
              <span>{isSavingToDrive ? t.savingToDrive : t.saveToDrive}</span>
            </button>

            <button
              onClick={() => {
                onDeleteItem(item.id);
                onClose();
              }}
              className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title={t.delete}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {driveFileUrl && (
            <a
              href={driveFileUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض الملف في Google Drive' : 'View in Google Drive'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
