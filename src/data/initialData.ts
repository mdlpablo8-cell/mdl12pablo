import { DownloadItem, AppSettings } from '../types';

export const INITIAL_ACTIVE_TRANSFERS: DownloadItem[] = [
  {
    id: 'active-1',
    title: 'Neon_City_Timelapse_4K.mp4',
    type: 'video',
    quality: '4K',
    status: 'downloading',
    progress: 65,
    currentSize: 1200, // 1.2 GB
    totalSize: 1800,  // 1.8 GB
    speed: 12.0,      // 12 MB/s
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9n5wA3CM1NfXABOXaJ8CDXgSEw4YCT4HOTKMcYtor4OhxYRTXuMXjVPqtvPdAGZXa4q4Wuts-uDwuckuwWSRY7kkEYj8T7axEbeygiHs82xADUwJnEipX6C3PM9RHBJVH4DQtHyS-uaNCru0ZJ7BdBeBzemsJzIeGKn-ixoZ1-75FzdVmYH5rubMiW0NLGNUuJM-uTODbS5qNPu-YdYR_xCR3zj5n7cwn-hY8GXP3RlObRiKJc3xm',
    date: 'Today',
    category: 'videos',
    duration: '04:18',
    threads: 8,
    codec: 'HEVC / H.265',
    bitrate: '45.2 Mbps',
    resolution: '3840x2160',
    sourceUrl: 'https://video.cdn.example.com/neon-city-4k-master.mp4'
  },
  {
    id: 'active-2',
    title: 'LoFi_Beats_Mix_Vol_3.mp3',
    type: 'audio',
    quality: 'HQ',
    status: 'downloading',
    progress: 22,
    currentSize: 35,  // 35 MB
    totalSize: 150,  // 150 MB
    speed: 4.5,      // 4.5 MB/s
    thumbnail: '',
    date: 'Today',
    category: 'audio',
    duration: '48:30',
    threads: 4,
    codec: 'MPEG-3 Audio (Layer III)',
    bitrate: '320 kbps (CBR)',
    resolution: 'Audio Stereo',
    sourceUrl: 'https://audio.cdn.example.com/lofi-beats-volume-3.mp3'
  }
];

export const INITIAL_COMPLETED_ITEMS: DownloadItem[] = [
  {
    id: 'completed-1',
    title: 'Nature_Doc_Ep1.mp4',
    arabicTitle: 'سلسلة الجبال الضبابية',
    type: 'video',
    quality: '1080p',
    status: 'completed',
    progress: 100,
    currentSize: 850,
    totalSize: 850,
    speed: 0,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlOz--ebfS4lUY3PdTrYpO0g4ylc3tGsSMxA7hvP5T7-7yaUZk_vnANv_z8nsOdco4epfPi1qtcKyLn6jvwW5Q6JKDC5z5oCnb8Q4rnR87-oKDVgOY4YPx4zr88-9dhiY-fubaX9nnioiTFBuaZvaCSMdQjs423Fys67TAOZcExMfdgg2CTmjUkLhaqx6UEdH0NvMGipxk7xzIe0fga0qhHtDvWO8jkVsZZbG8IgX8-Qo57rvqV8PS',
    date: 'Today, 10:42 AM',
    completedAt: 'Today, 10:42 AM',
    category: 'videos',
    duration: '14:22',
    codec: 'H.264 / AVC High@L4.1',
    bitrate: '8.4 Mbps',
    resolution: '1920x1080 (60fps)',
    sourceUrl: 'https://cdn.nature-docs.org/episodes/misty-mountains-1080p.mp4'
  },
  {
    id: 'completed-2',
    title: 'Abstract_Motion_Bkg.mov',
    type: 'video',
    quality: '4K',
    status: 'completed',
    progress: 100,
    currentSize: 420,
    totalSize: 420,
    speed: 0,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD37bgyGY9uXuT5ghYO82Cz69MQwDTP5ihDhOOJMxydPdlnfJlyrStVZWsciSwucvwUW6Dzo4xHRObgjwU82uImW00s4EfbU3UDyjyS6MGpfcMJOVds14yiUeDS2jRcrzSOJFkajJ8o55GE25pKxlZ1ScrldZjD0LMloEz9FkWO-q2gK0LAVDZ6gZfmRXiU2IbKLhO2FokGDY8XvleN1tKDFFI8EsFLh6HqGDFdgoe5PQjGeXsUMas',
    date: 'Yesterday',
    completedAt: 'Yesterday, 4:15 PM',
    category: 'videos',
    duration: '02:05',
    codec: 'Apple ProRes / QuickTime',
    bitrate: '28.0 Mbps',
    resolution: '3840x2160',
    sourceUrl: 'https://motion-assets.art/abstract/fluid-vortex-4k.mov'
  },
  {
    id: 'completed-3',
    title: 'Cyberpunk_Night_Flight_60fps.mp4',
    type: 'video',
    quality: '4K',
    status: 'completed',
    progress: 100,
    currentSize: 1650,
    totalSize: 1650,
    speed: 0,
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    date: '3 days ago',
    completedAt: 'Aug 29, 2026',
    category: 'videos',
    duration: '08:45',
    codec: 'HEVC / H.265 Main 10',
    bitrate: '35.0 Mbps',
    resolution: '3840x2160 (60fps)',
    sourceUrl: 'https://timelapse.example.com/cyberpunk-night-flight.mp4'
  },
  {
    id: 'completed-4',
    title: 'Ambient_Chillwave_Master.flac',
    type: 'audio',
    quality: 'FLAC',
    status: 'completed',
    progress: 100,
    currentSize: 210,
    totalSize: 210,
    speed: 0,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    date: '4 days ago',
    completedAt: 'Aug 28, 2026',
    category: 'audio',
    duration: '32:10',
    codec: 'Free Lossless Audio Codec (24-bit/96kHz)',
    bitrate: '1411 kbps',
    resolution: 'Hi-Res Stereo',
    sourceUrl: 'https://audio.example.com/ambient-master.flac'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  language: 'ar', // Set to Arabic by default matching user request prompt, toggleable easily
  theme: 'dark',
  maxConcurrent: 3,
  maxSpeedMBps: 0,
  turboThreads: 8,
  downloadPath: '/storage/emulated/0/MDL_Downloads',
  autoResume: true,
  wifiOnly: false,
  notificationSound: true,
  autoExtractArchive: true,
};

export const PRESET_DOWNLOADS = [
  {
    title: 'Tokyo_Rainy_Streets_4K_HDR.mp4',
    type: 'video' as const,
    quality: '4K' as const,
    sizeMB: 1450,
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    url: 'https://demo.stream.org/tokyo-rainy-streets-4k.mp4',
    duration: '06:12'
  },
  {
    title: 'Deep_Focus_Coding_Radio.mp3',
    type: 'audio' as const,
    quality: 'HQ' as const,
    sizeMB: 85,
    thumbnail: '',
    url: 'https://demo.stream.org/deep-focus-coding.mp3',
    duration: '55:00'
  },
  {
    title: 'Aurora_Borealis_Cinematic.mp4',
    type: 'video' as const,
    quality: '1080p' as const,
    sizeMB: 620,
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    url: 'https://demo.stream.org/aurora-borealis-1080p.mp4',
    duration: '05:30'
  }
];
