
import React, { useState } from 'react';
import { Palette, Check, Shield, Bell, User, ChevronRight, BellOff, Info, Sparkles, Clock, Volume2, VolumeX } from 'lucide-react';
import { ThemeType } from '../types';

interface SettingsProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: ThemeType;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, resolvedTheme, soundEnabled, setSoundEnabled }) => {
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(resolvedTheme);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const themes: { id: ThemeType; name: string; colors: string[]; description?: string }[] = [
    { id: 'auto', name: 'Dynamic Circadian', colors: ['bg-blue-400', 'bg-orange-400'], description: 'Syncs with time of day' },
    { id: 'bio-synth', name: 'Bio-Synth', colors: ['bg-emerald-500', 'bg-emerald-50'] },
    { id: 'midnight', name: 'Midnight Tech', colors: ['bg-blue-600', 'bg-slate-900'] },
    { id: 'autumn', name: 'Autumn Gold', colors: ['bg-orange-600', 'bg-orange-50'] },
    { id: 'nordic', name: 'Nordic Frost', colors: ['bg-slate-800', 'bg-slate-200'] },
    { id: 'obsidian', name: 'Obsidian Royal', colors: ['bg-violet-600', 'bg-black'] },
    { id: 'cyberpunk', name: 'Cyber Punk', colors: ['bg-fuchsia-600', 'bg-[#0f0524]'] },
    { id: 'desert', name: 'Desert Mirage', colors: ['bg-[#d97706]', 'bg-[#fff9f0]'] },
    { id: 'forest', name: 'Forest Deep', colors: ['bg-emerald-800', 'bg-[#0a1a0a]'] },
    { id: 'ocean', name: 'Ocean Abyss', colors: ['bg-cyan-600', 'bg-[#020c1b]'] },
    { id: 'sakura', name: 'Sakura Bloom', colors: ['bg-pink-400', 'bg-[#fff5f7]'] },
    { id: 'volcanic', name: 'Volcanic Ash', colors: ['bg-red-600', 'bg-[#1a1311]'] },
    { id: 'electric', name: 'Electric Grape', colors: ['bg-indigo-600', 'bg-[#12002e]'] },
    { id: 'matcha', name: 'Matcha Zen', colors: ['bg-[#606c38]', 'bg-[#fcfdf2]'] },
    { id: 'solar', name: 'Solar Flare', colors: ['bg-yellow-500', 'bg-[#1a1200]'] },
    { id: 'mint', name: 'Minty Fresh', colors: ['bg-teal-500', 'bg-[#f0fffb]'] },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in slide-in-from-bottom-2 ${
          isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'
        }`}>
          {toast}
        </div>
      )}

      <div>
        <h2 className={`text-4xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
        <p className={`font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Configure your AgriGuard AI experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Appearance Section */}
          <section className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-zinc-800 backdrop-blur-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                  <Palette size={24} strokeWidth={2.5} />
                </div>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Visual Profile</h3>
              </div>
              {theme === 'auto' && (
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <Clock size={12} />
                  Current Active: {resolvedTheme}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                    theme === t.id 
                    ? (isDark ? 'border-white bg-zinc-800 shadow-xl' : 'border-emerald-500 bg-emerald-50/30 shadow-lg shadow-emerald-900/5') 
                    : (isDark ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700' : 'border-slate-100 bg-slate-50 hover:border-slate-300')
                  }`}
                >
                  {t.id === 'auto' && (
                    <div className="absolute top-0 right-0 p-2">
                      <Sparkles size={14} className="text-blue-500 animate-pulse" />
                    </div>
                  )}
                  <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex -space-x-2">
                      <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 ${t.colors[0]} shadow-sm`} />
                      <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 ${t.colors[1]} shadow-sm`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black text-xs ${theme === t.id ? (isDark ? 'text-white' : 'text-emerald-700') : (isDark ? 'text-zinc-500' : 'text-slate-600')}`}>
                        {t.name}
                      </span>
                      {t.description && (
                        <span className="text-[9px] font-bold opacity-40 leading-none mt-1 uppercase tracking-tighter">{t.description}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Interactive Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sound Toggle */}
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(`Sound Alerts ${!soundEnabled ? 'Enabled' : 'Muted'}`);
              }}
              className={`p-6 rounded-[2.5rem] border transition-all hover:translate-y-[-4px] hover:shadow-2xl text-left flex items-center justify-between group ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-white backdrop-blur-xl' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-3xl transition-all duration-500 ${
                  soundEnabled 
                  ? (isDark ? 'bg-orange-500/20 text-orange-500' : 'bg-orange-50 text-orange-600') 
                  : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-slate-100 text-slate-300')
                }`}>
                  {soundEnabled ? <Volume2 size={24} strokeWidth={2.5} /> : <VolumeX size={24} strokeWidth={2.5} />}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg">Sound Alerts</span>
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{soundEnabled ? 'Critical Audio On' : 'Silent Mode'}</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all ${soundEnabled ? 'bg-orange-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${soundEnabled ? 'left-7' : 'left-1'}`} />
              </div>
            </button>

            <button 
              onClick={() => {
                setNotifications(!notifications);
                showToast(`Notifications ${!notifications ? 'Active' : 'Muted'}`);
              }}
              className={`p-6 rounded-[2.5rem] border transition-all hover:translate-y-[-4px] hover:shadow-2xl text-left flex items-center justify-between group ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-white backdrop-blur-xl' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-3xl transition-all duration-500 ${
                  notifications 
                  ? (isDark ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-50 text-blue-600') 
                  : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-slate-100 text-slate-300')
                }`}>
                  {notifications ? <Bell size={24} strokeWidth={2.5} className="animate-bounce" /> : <BellOff size={24} strokeWidth={2.5} />}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg">Telemetry Alerts</span>
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{notifications ? 'Streaming Live' : 'Muted'}</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all ${notifications ? 'bg-blue-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${notifications ? 'left-7' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className={`p-8 rounded-[3rem] border animate-float ${isDark ? 'bg-zinc-900 border-zinc-800 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-800 shadow-xl'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em]">AgriCore V4.0</h4>
            </div>
            <p className="text-sm font-bold opacity-60 leading-relaxed mb-8">
              Intelligence synchronized with the planetary rhythm. Powered by Gemini-3 multimodal reasoning.
            </p>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                <span>Core Temperature</span>
                <span className="text-emerald-500">Normal</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4 animate-pulse" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                <span>Neural Synapse</span>
                <span className="text-blue-500">Optimized</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
