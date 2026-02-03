import React from 'react';
import { 
  Droplet, 
  Power, 
  Zap, 
  Clock, 
  Settings2, 
  Waves,
  AlertCircle,
  Lock
} from 'lucide-react';
import { IrrigationState, SensorData, ThemeType } from '../types';

interface IrrigationHubProps {
  irrigation: IrrigationState;
  setIrrigation: React.Dispatch<React.SetStateAction<IrrigationState>>;
  data: SensorData;
  theme: ThemeType;
}

const IrrigationHub: React.FC<IrrigationHubProps> = ({ irrigation, setIrrigation, data, theme }) => {
  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(theme);
  
  const togglePump = () => {
    if (irrigation.isAutoMode) return;
    setIrrigation(prev => ({ ...prev, isPumpOn: !prev.isPumpOn }));
  };

  const toggleAuto = () => {
    setIrrigation(prev => ({ 
      ...prev, 
      isAutoMode: !prev.isAutoMode,
      isPumpOn: false 
    }));
  };

  const themeAccentColor = 
    theme === 'bio-synth' ? 'text-emerald-500' : 
    theme === 'midnight' ? 'text-blue-500' : 
    theme === 'autumn' ? 'text-orange-600' : 
    theme === 'nordic' ? 'text-slate-800' : 'text-violet-500';

  const themeAccentBg = 
    theme === 'bio-synth' ? 'bg-emerald-500' : 
    theme === 'midnight' ? 'bg-blue-600' : 
    theme === 'autumn' ? 'bg-orange-600' : 
    theme === 'nordic' ? 'bg-slate-800' : 'bg-violet-600';

  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-right-8 duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-2 md:mb-3 inline-block ${
            isDark ? 'bg-white/10 text-white' : 'bg-blue-100 text-blue-700'
          }`}>Water Management</span>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Smart Irrigation</h2>
        </div>
        
        <div className={`flex items-center gap-4 md:gap-6 px-5 md:px-8 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] border transition-all ${
          isDark ? 'bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex flex-col">
            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Autonomous Mode</span>
            <span className={`text-xs md:text-sm font-black ${irrigation.isAutoMode ? 'text-emerald-500' : 'text-slate-400'}`}>
              {irrigation.isAutoMode ? 'AgriCore Active' : 'Manual Override'}
            </span>
          </div>
          <button 
            onClick={toggleAuto}
            aria-label="Toggle Autonomous Mode"
            className={`w-12 md:w-14 h-7 md:h-8 rounded-full transition-all relative p-1 ${
              irrigation.isAutoMode ? (isDark ? 'bg-blue-600' : 'bg-emerald-500') : (isDark ? 'bg-zinc-800' : 'bg-slate-200')
            }`}
          >
            <div className={`w-5 md:w-6 h-5 md:h-6 bg-white rounded-full transition-all shadow-lg ${
              irrigation.isAutoMode ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Main Moisture Control Card */}
        <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 ${
          isDark ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'
        } relative overflow-hidden flex flex-col items-center`}>
          <div className="relative z-10 w-full flex flex-col items-center gap-6 md:gap-10">
            {/* Moisture Meter Visual */}
            <div className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-[10px] md:border-[14px] flex flex-col items-center justify-center transition-all duration-1000 ${
              irrigation.isPumpOn 
              ? (isDark ? 'border-blue-500 shadow-[0_0_80px_-20px_rgba(59,130,246,0.6)]' : 'border-blue-400 shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)]') 
              : (isDark ? 'border-zinc-800' : 'border-slate-50')
            }`}>
              <Waves className={`w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4 transition-all duration-700 ${irrigation.isPumpOn ? 'text-blue-500 animate-bounce' : 'text-zinc-700 dark:text-zinc-500 opacity-20'}`} strokeWidth={3} />
              <div className="flex items-baseline">
                <span className={`text-5xl md:text-7xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{data.moisture}</span>
                <span className={`text-xl md:text-2xl font-black ml-1 ${isDark ? 'text-zinc-600' : 'text-slate-300'}`}>%</span>
              </div>
              <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-1 md:mt-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Current Moisture</span>
            </div>

            <div className="w-full space-y-4 md:space-y-6">
              {/* Pump Toggle Control */}
              <div className={`flex flex-col sm:flex-row justify-between items-center p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all gap-4 ${
                irrigation.isAutoMode ? 'opacity-60 grayscale' : ''
              } ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                  <div className={`p-3 md:p-5 rounded-2xl md:rounded-3xl transition-all duration-700 ${irrigation.isPumpOn ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : (isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-slate-200 text-slate-400')}`}>
                    {irrigation.isAutoMode ? <Lock size={24} className="md:w-8 md:h-8" /> : <Power size={24} className="md:w-8 md:h-8" strokeWidth={3} />}
                  </div>
                  <div>
                    <h5 className={`font-black text-lg md:text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>Flow Control</h5>
                    <p className={`text-xs md:text-sm font-bold ${irrigation.isPumpOn ? 'text-blue-500' : (isDark ? 'text-zinc-500' : 'text-slate-400')}`}>
                      {irrigation.isPumpOn ? 'Pump Running' : 'Pump Standby'}
                    </p>
                  </div>
                </div>
                <button 
                  disabled={irrigation.isAutoMode}
                  onClick={togglePump}
                  className={`w-full sm:w-auto px-10 md:px-12 py-3 md:py-5 rounded-xl md:rounded-3xl font-black text-base md:text-lg transition-all transform active:scale-90 ${
                    irrigation.isAutoMode ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' :
                    irrigation.isPumpOn ? 'bg-rose-500 text-white shadow-xl' : 
                    `${themeAccentBg} text-white shadow-xl`
                  }`}
                >
                  {irrigation.isPumpOn ? 'SHUT OFF' : 'START FLOW'}
                </button>
              </div>

              {irrigation.isAutoMode && (
                <div className={`flex items-center justify-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'} border border-blue-500/20 animate-pulse`}>
                  <AlertCircle size={16} />
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-center">AI Hub is managing hydration autonomously</span>
                </div>
              )}

              {/* Threshold Setting */}
              <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${
                isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Settings2 size={18} className={`md:w-5 md:h-5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} strokeWidth={3} />
                    <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Trigger Threshold</span>
                  </div>
                  <span className={`font-black text-2xl md:text-3xl ${themeAccentColor}`}>{irrigation.threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  value={irrigation.threshold}
                  onChange={(e) => setIrrigation(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                  className={`w-full h-3 md:h-4 rounded-2xl appearance-none cursor-pointer ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}
                  style={{ accentColor: isDark ? '#3b82f6' : '#10b981' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Stats & Metrics */}
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <Zap className="text-amber-500 mb-4 md:mb-6" size={28} md:size={36} strokeWidth={3} />
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Energy Efficiency</p>
              <h4 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>A++ <span className="text-xs md:text-sm font-bold opacity-30">RATING</span></h4>
            </div>
            <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <Clock className="text-indigo-500 mb-4 md:mb-6" size={28} md:size={36} strokeWidth={3} />
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Next AI Check</p>
              <h4 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>30 <span className="text-xs md:text-sm font-bold opacity-30">SEC</span></h4>
            </div>
          </div>

          <div className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white space-y-6 md:space-y-10 relative overflow-hidden transition-all duration-1000 ${
            theme === 'bio-synth' ? 'bg-emerald-600 shadow-emerald-900/30 shadow-2xl' : 
            theme === 'midnight' ? 'bg-blue-700 shadow-blue-900/30 shadow-2xl' : 
            theme === 'autumn' ? 'bg-orange-700 shadow-orange-900/30 shadow-2xl' : 
            theme === 'nordic' ? 'bg-slate-900 shadow-black shadow-2xl' : 'bg-violet-700 shadow-violet-900/30 shadow-2xl'
          }`}>
            <h4 className="font-black text-2xl md:text-3xl tracking-tight">Conservation Metrics</h4>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-6 bg-white/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/20 flex items-center justify-center shrink-0">
                  <Droplet size={24} md:size={32} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Saved This Week</p>
                  <p className="text-xl md:text-2xl font-black">1.2k <span className="text-emerald-300 text-[10px] md:text-xs ml-1 uppercase">Litres</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationHub;