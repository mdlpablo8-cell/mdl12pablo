import React, { useState } from 'react';
import { 
  Link, 
  Clipboard, 
  Download, 
  Sparkles, 
  HardDrive, 
  Zap, 
  Check, 
  Film, 
  Music, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Language, QualityTag, MediaType } from '../types';
import { translations } from '../utils/translations';
import { PRESET_DOWNLOADS } from '../data/initialData';
import { extractCombinedMediaStream } from '../utils/mediaExtractor';

interface HomeViewProps {
  language: Language;
  onStartDownload: (params: {
    url: string;
    title: string;
    quality: QualityTag;
    type: MediaType;
    thumbnail?: string;
    sizeMB: number;
    codec?: string;
    duration?: string;
  }) => void;
  onNavigateToDownloads: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onStartDownload,
  onNavigateToDownloads,
}) => {
  const t = translations[language];
  const [urlInput, setUrlInput] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<QualityTag>('1080p');
  const [selectedType, setSelectedType] = useState<MediaType>('video');
  const [isPasting, setIsPasting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  const handlePasteClipboard = async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
      }
    } catch {
      // Fallback sample URL if browser clipboard permission is restricted
      setUrlInput('https://video.cdn.example.com/cinematic-drone-4k.mp4');
    } finally {
      setTimeout(() => setIsPasting(false), 500);
    }
  };

  const handleStartCustomDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setIsAnalyzing(true);
      // Run the combined audio+video stream extractor
      const stream = await extractCombinedMediaStream(urlInput, selectedType, selectedQuality);

      let derivedTitle = customTitle.trim() || stream.title;

      onStartDownload({
        url: stream.directDownloadUrl || urlInput,
        title: derivedTitle,
        quality: selectedQuality,
        type: selectedType,
        sizeMB: stream.sizeMB,
        thumbnail: stream.thumbnail,
        codec: stream.codec,
        duration: stream.duration,
      });

      setUrlInput('');
      setCustomTitle('');
      onNavigateToDownloads();
    } catch (err) {
      console.error(err);
      onStartDownload({
        url: urlInput,
        title: customTitle.trim() || `Media_${Date.now().toString().slice(-4)}.${selectedType === 'video' ? 'mp4' : 'mp3'}`,
        quality: selectedQuality,
        type: selectedType,
        sizeMB: selectedQuality === '4K' ? 1400 : 750,
        thumbnail: selectedType === 'video' ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' : '',
      });
      onNavigateToDownloads();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickPreset = (preset: typeof PRESET_DOWNLOADS[0]) => {
    onStartDownload({
      url: preset.url,
      title: preset.title,
      quality: preset.quality,
      type: preset.type,
      thumbnail: preset.thumbnail,
      sizeMB: preset.sizeMB,
      codec: 'H.264 / AAC High Muxed',
      duration: preset.duration,
    });
    onNavigateToDownloads();
  };

  const supportedPlatforms = [
    { name: 'YouTube', badge: 'Audio+4K Muxed', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { name: 'TikTok', badge: 'HD + Sound', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { name: 'Instagram', badge: 'Reels Audio', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { name: 'X / Twitter', badge: 'MP4 HD+Audio', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'SoundCloud', badge: 'HQ 320k', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Direct Links', badge: 'Combined Stream', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div id="home-screen-container" className="space-y-6 pb-28">
      {/* Downloader Card Header */}
      <section className="glass-card rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden border border-white/15">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {language === 'ar' ? 'أداة التنزيل واستخراج الوسائط المدمجة' : 'High-Speed Combined Stream Downloader'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'استخراج رابط الفيديو الكامل متضمناً الصوت النقي (Combined Audio & Video) بجودة فائقة'
                : 'Extracts full synchronized video & audio streams with multi-thread speed'}
            </p>
          </div>
        </div>

        {/* Combined Audio Stream Guarantee Banner */}
        <div className="my-3 p-2.5 bg-emerald-950/40 border border-emerald-500/25 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{t.combinedStreamAudio}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
            {t.combinedBadge}
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleStartCustomDownload} className="mt-4 space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Link className="w-4 h-4" />
            </div>
            <input
              type="url"
              id="input-media-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t.enterUrlPlaceholder}
              className="w-full bg-[#131b2e] border border-slate-700/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-24 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              required
            />
            <button
              type="button"
              id="btn-paste-clipboard"
              onClick={handlePasteClipboard}
              className="absolute right-2 px-3 py-1.5 bg-[#1e293b] hover:bg-indigo-950/80 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{isPasting ? (language === 'ar' ? 'تم!' : 'Pasted!') : t.pasteLink}</span>
            </button>
          </div>

          {/* Quality & Format selector tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-white/5">
              {(['video', 'audio'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    if (type === 'audio' && selectedQuality !== 'HQ' && selectedQuality !== 'FLAC') {
                      setSelectedQuality('HQ');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'video' ? <Film className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
                  <span>{type === 'video' ? t.videos : t.audio}</span>
                </button>
              ))}
            </div>

            {/* Quality resolution pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(selectedType === 'video' ? ['4K', '1080p', '720p'] : ['HQ', '320k', 'FLAC']).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSelectedQuality(q as QualityTag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                    selectedQuality === q
                      ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200'
                      : 'bg-[#131b2e] border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Start Download Button */}
          <button
            type="submit"
            id="btn-submit-download"
            disabled={!urlInput.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(79,70,229,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.fetchingStream}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{t.downloadNow}</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Quick Presets / Test Downloads */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.presets}</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'فيديو وصوت كامل فوري' : 'Full Audio+Video Stream'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_DOWNLOADS.map((preset, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:border-indigo-500/40 transition-all group cursor-pointer"
              onClick={() => handleQuickPreset(preset)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-900/40 text-indigo-300 border border-indigo-500/20">
                    {preset.type === 'video' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {preset.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {preset.quality} • {preset.sizeMB} MB • Combined Audio
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-indigo-400 font-medium pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>{language === 'ar' ? 'تحميل مباشر' : 'Quick Fetch'}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300">
          {t.supportedPlatforms}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {supportedPlatforms.map((platform, idx) => (
            <div
              key={idx}
              className="glass-card-subtle rounded-xl p-3 flex items-center justify-between border border-white/5"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {platform.name}
                </span>
                <span className="text-[10px] text-slate-400">{platform.badge}</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Storage meter summary */}
      <section className="glass-card-subtle rounded-2xl p-4 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              {t.storageUsed}
            </span>
            <span className="text-[11px] text-slate-400">{t.freeSpace}</span>
          </div>
        </div>
        <div className="w-24 bg-[#222c47] h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[42%] rounded-full" />
        </div>
      </section>
    </div>
  );
};
