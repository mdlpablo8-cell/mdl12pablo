import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  RotateCw,
  Film, 
  Music, 
  Download, 
  Share2,
  Sliders
} from 'lucide-react';
import { DownloadItem, Language } from '../types';
import { translations } from '../utils/translations';

interface MediaPlayerModalProps {
  item: DownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  item,
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen || !item) return null;

  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(18);
  const totalDuration = 180; // 3:00 min sample
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Playback timer ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0b1326]/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300">
              {item.type === 'video' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate">{item.title}</h3>
              <p className="text-[11px] text-slate-400">
                {item.quality} • {item.codec || 'H.264 Audio/Video'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video / Visualizer Stage */}
        <div className="relative bg-black aspect-video max-h-[460px] flex items-center justify-center overflow-hidden group">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isPlaying ? 'scale-102 filter-none' : 'scale-100 brightness-90'
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.5)] animate-pulse">
                <Music className="w-12 h-12 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">High-Fidelity Audio Stream</p>
              </div>
            </div>
          )}

          {/* Center Play/Pause Floating Click Indicator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all active:scale-90 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Quality watermark */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded border border-white/10">
            {item.quality} • 60 FPS
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#0b1326]/90 border-t border-white/10 space-y-3">
          {/* Progress scrubber */}
          <div className="space-y-1">
            <div className="relative flex items-center group cursor-pointer">
              <input
                type="range"
                min={0}
                max={totalDuration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Play/Pause & Skip */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTime((prev) => Math.max(0, prev - 10))}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all active:scale-95 shadow-md cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime((prev) => Math.min(totalDuration, prev + 10))}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 bg-[#131b2e] px-2 py-1 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Speed</span>
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
