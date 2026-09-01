import React, { useState } from 'react';
import { 
  Languages, 
  Moon, 
  Zap, 
  Folder, 
  HardDrive, 
  Wifi, 
  Bell, 
  Info, 
  Trash2, 
  Check, 
  Cpu,
  Layers,
  Sparkles,
  Cloud,
  CheckCircle2,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { AppSettings, Language } from '../types';
import { translations } from '../utils/translations';
import { getSavedDriveSession, connectGoogleDrive, disconnectGoogleDrive } from '../utils/googleDrive';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearCache: () => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearCache,
  onToast,
}) => {
  const t = translations[settings.language];
  const [cacheClearedToast, setCacheClearedToast] = useState(false);
  const [driveSession, setDriveSession] = useState(() => getSavedDriveSession());
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);

  const handleConnectDrive = async () => {
    try {
      setIsConnectingDrive(true);
      const user = await connectGoogleDrive();
      setDriveSession(user);
      onToast(settings.language === 'ar' ? 'تم ربط حساب Google Drive بنجاح!' : 'Connected Google Drive successfully!');
    } catch (err: any) {
      console.error(err);
      onToast(settings.language === 'ar' ? 'فشل الاتصال بجوجل درايف' : 'Failed to connect Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };

  const handleDisconnectDrive = () => {
    disconnectGoogleDrive();
    setDriveSession(null);
    onToast(settings.language === 'ar' ? 'تم فصل Google Drive' : 'Disconnected Google Drive');
  };

  const handleClearCacheClick = () => {
    onClearCache();
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 3000);
  };

  return (
    <div id="settings-screen-container" className="space-y-6 pb-28">
      {/* 1. Google Drive Cloud Sync */}
      <section className="glass-card rounded-2xl p-5 space-y-4 shadow-sm border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-100 font-bold text-sm">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <span>{t.googleDrive}</span>
              <span className="block text-[11px] text-slate-400 font-normal">
                {settings.language === 'ar' ? 'مزامنة وحفظ الوسائط المدمجة بالصوت مباشرة في السحابة' : 'Sync and upload full audio+video media directly to cloud'}
              </span>
            </div>
          </div>
          {driveSession && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              {t.driveConnected}
            </span>
          )}
        </div>

        {driveSession ? (
          <div className="p-3 bg-[#131b2e] rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                GD
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">{driveSession.email || 'Google User'}</span>
                <span className="text-[10px] text-emerald-400">{settings.language === 'ar' ? 'جاهز للرفع والمزامنة' : 'Ready for direct cloud export'}</span>
              </div>
            </div>

            <button
              onClick={handleDisconnectDrive}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-lg text-xs font-semibold cursor-pointer transition-all"
            >
              {settings.language === 'ar' ? 'فصل' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectDrive}
            disabled={isConnectingDrive}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Cloud className="w-4 h-4" />
            <span>{isConnectingDrive ? 'Connecting...' : t.connectGoogleDrive}</span>
          </button>
        )}
      </section>

      {/* 2. Stream Audio & Video Muxing Preferences */}
      <section className="glass-card rounded-2xl p-5 space-y-3 shadow-sm border border-white/10">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>{settings.language === 'ar' ? 'دفق الصوت والصورة المتزامن' : 'Combined Stream & Audio Muxing'}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {settings.language === 'ar'
            ? 'تطبيق MDL يقوم دائماً باستخراج ودمج مسار الصوت النقي (Combined Video & Audio) بدلاً من استخراج الفيديو الصامت فقط، لضمان تشغيل ومزامنة الصوت مع الفيديو بدقة 4K و 1080p.'
            : 'MDL extracts and muxes full synchronized audio streams directly with video streams to guarantee crystal-clear audio on all 4K and 1080p downloads.'}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{settings.language === 'ar' ? 'مفعل افتراضياً لجميع الروابط المضافة' : 'Active by default for all extracted streams'}</span>
        </div>
      </section>

      {/* 3. Language & Appearance */}
      <section className="glass-card rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <Languages className="w-4 h-4 text-indigo-400" />
          <span>{t.appearance} & {t.language}</span>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{t.language}</span>
            <span className="text-[11px] text-slate-400">
              {settings.language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => onUpdateSettings({ language: 'ar' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                settings.language === 'ar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => onUpdateSettings({ language: 'en' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                settings.language === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme mode */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{t.theme}</span>
            <span className="text-[11px] text-slate-400">
              {settings.language === 'ar' ? 'نمط زجاجي داكن عالي التباين' : 'High-contrast Glassmorphic Dark'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#131b2e] text-indigo-300 rounded-lg border border-indigo-500/20">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dark Glass</span>
          </div>
        </div>
      </section>

      {/* 4. Network & Acceleration */}
      <section className="glass-card rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{t.networkAndSpeed}</span>
        </div>

        {/* Turbo Multi-Thread connections */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{t.multiThreadEngine}</span>
            <span className="text-[11px] text-slate-400">
              {settings.language === 'ar' ? 'تسريع متعدد القنوات (8x مسارات)' : 'Parallel segmented chunk downloader'}
            </span>
          </div>

          <select
            value={settings.turboThreads}
            onChange={(e) => onUpdateSettings({ turboThreads: Number(e.target.value) })}
            className="bg-[#131b2e] border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-semibold outline-none cursor-pointer"
          >
            <option value={4}>4 Threads</option>
            <option value={8}>8 Threads (Turbo)</option>
            <option value={16}>16 Threads (Max)</option>
          </select>
        </div>

        {/* Max concurrent downloads */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{t.maxConcurrentDownloads}</span>
            <span className="text-[11px] text-slate-400">
              {settings.language === 'ar' ? 'عدد التنزيلات النشطة في نفس الوقت' : 'Active simultaneous transfer limit'}
            </span>
          </div>

          <select
            value={settings.maxConcurrent}
            onChange={(e) => onUpdateSettings({ maxConcurrent: Number(e.target.value) })}
            className="bg-[#131b2e] border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-semibold outline-none cursor-pointer"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3 (Default)</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* Wi-Fi only toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">{t.wifiOnlyDownload}</span>
              <span className="text-[11px] text-slate-400">
                {settings.language === 'ar' ? 'حفظ باقة بيانات الهاتف' : 'Prevent mobile cellular data usage'}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.wifiOnly}
              onChange={(e) => onUpdateSettings({ wifiOnly: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Auto Resume Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">{t.autoResumeTransfers}</span>
              <span className="text-[11px] text-slate-400">
                {settings.language === 'ar' ? 'استئناف تلقائي من نقطة التوقف' : 'Resumes broken transfers seamlessly'}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoResume}
              onChange={(e) => onUpdateSettings({ autoResume: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </section>

      {/* 5. Storage & Cache Management */}
      <section className="glass-card rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>{t.storageAndCache}</span>
        </div>

        {/* Directory location */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-200 block">{t.downloadLocation}</span>
          <div className="flex items-center gap-2 bg-[#131b2e] p-2.5 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">
            <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{settings.downloadPath}</span>
          </div>
        </div>

        {/* Clear cache button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{t.clearCache}</span>
            <span className="text-[11px] text-slate-400">
              {settings.language === 'ar' ? 'تنظيف 420 ميجابايت من الملفات المؤقتة' : 'Temporary segment buffers (420 MB)'}
            </span>
          </div>

          <button
            onClick={handleClearCacheClick}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearCache}</span>
          </button>
        </div>

        {cacheClearedToast && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{t.cacheCleared}</span>
          </div>
        )}
      </section>

      {/* 6. About App */}
      <section className="glass-card-subtle rounded-2xl p-4 text-center space-y-1 border border-white/5">
        <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
          {t.aboutMDL}
        </h4>
        <p className="text-[11px] text-slate-500">
          {t.version} • Combined Video+Audio Engine & Google Drive Sync
        </p>
      </section>
    </div>
  );
};
