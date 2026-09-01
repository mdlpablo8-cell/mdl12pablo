import React, { useState } from 'react';
import { X, Download, Link, Film, Music, Sparkles, Zap, Clipboard } from 'lucide-react';
import { Language, QualityTag, MediaType } from '../types';
import { translations } from '../utils/translations';

interface NewDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onStartDownload: (params: {
    url: string;
    title: string;
    quality: QualityTag;
    type: MediaType;
    thumbnail?: string;
    sizeMB: number;
  }) => void;
}

export const NewDownloadModal: React.FC<NewDownloadModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartDownload,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('video');
  const [quality, setQuality] = useState<QualityTag>('4K');
  const [isPasting, setIsPasting] = useState(false);

  const handlePaste = async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      setUrl('https://cdn.streams.net/nature_documentary_4k_hdr.mp4');
    } finally {
      setTimeout(() => setIsPasting(false), 400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalTitle = title.trim();
    if (!finalTitle) {
      const ext = type === 'video' ? 'mp4' : 'mp3';
      finalTitle = `Download_${Date.now().toString().slice(-4)}.${ext}`;
    }

    const estimatedSize = quality === '4K' ? 1750 : quality === '1080p' ? 820 : quality === 'HQ' ? 140 : 400;

    onStartDownload({
      url,
      title: finalTitle,
      quality,
      type,
      sizeMB: estimatedSize,
      thumbnail: type === 'video' ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' : ''
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/15 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{t.newDownload}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'أضف رابط الوسائط لبدء التحميل الفوري' : 'Paste media link for immediate accelerated download'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* URL Input with Paste */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {language === 'ar' ? 'رابط الملف / الفيديو' : 'Media URL'}
            </label>
            <div className="relative flex items-center">
              <Link className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl pl-10 pr-24 py-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 px-3 py-1 bg-[#1e293b] text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-950 flex items-center gap-1 cursor-pointer border border-indigo-500/20"
              >
                <Clipboard className="w-3 h-3" />
                <span>{isPasting ? '...' : t.pasteLink}</span>
              </button>
            </div>
          </div>

          {/* Custom File Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {language === 'ar' ? 'اسم الملف (اختياري)' : 'File Name (Optional)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My_Downloaded_Video.mp4"
              className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type & Quality selection */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">{t.format}</label>
              <div className="flex bg-[#131b2e] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setType('video');
                    setQuality('4K');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>MP4</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('audio');
                    setQuality('HQ');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === 'audio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>MP3</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">{t.quality}</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as QualityTag)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-indigo-300 font-semibold outline-none cursor-pointer"
              >
                {type === 'video' ? (
                  <>
                    <option value="4K">4K UHD (2160p)</option>
                    <option value="1080p">Full HD (1080p)</option>
                    <option value="720p">HD (720p)</option>
                  </>
                ) : (
                  <>
                    <option value="HQ">HQ Stereo (320 kbps)</option>
                    <option value="FLAC">Lossless FLAC</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadNow}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
