
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  TrendingUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { SensorData, ThemeType } from '../types';

interface DashboardProps {
  historicalData: SensorData[];
  onViewReports: () => void;
  theme: ThemeType;
}

const Dashboard: React.FC<DashboardProps> = ({ historicalData, onViewReports, theme }) => {
  const currentData = historicalData[historicalData.length - 1];
  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(theme);

  // Added 'auto' key to themeColors to fix missing property error for Record<ThemeType, string>
  const themeColors: Record<ThemeType, string> = {
    'auto': '#10b981',
    'bio-synth': '#10b981',
    'midnight': '#2563eb',
    'autumn': '#ea580c',
    'nordic': '#1e293b',
    'obsidian': '#7c3aed',
    'cyberpunk': '#d946ef',
    'desert': '#d97706',
    'forest': '#065f46',
    'ocean': '#0891b2',
    'sakura': '#f472b6',
    'volcanic': '#dc2626',
    'electric': '#4f46e5',
    'matcha': '#606c38',
    'solar': '#eab308',
    'mint': '#14b8a6'
  };

  const getAccentBg = (t: ThemeType) => {
    switch (t) {
      case 'bio-synth': return 'bg-emerald-500';
      case 'midnight': return 'bg-blue-600';
      case 'autumn': return 'bg-orange-600';
      case 'nordic': return 'bg-slate-800';
      case 'obsidian': return 'bg-violet-600';
      case 'cyberpunk': return 'bg-fuchsia-600';
      case 'desert': return 'bg-orange-700';
      case 'forest': return 'bg-emerald-800';
      case 'ocean': return 'bg-cyan-600';
      case 'sakura': return 'bg-pink-400';
      case 'volcanic': return 'bg-red-600';
      case 'electric': return 'bg-indigo-600';
      case 'matcha': return 'bg-[#606c38]';
      case 'solar': return 'bg-yellow-500';
      case 'mint': return 'bg-teal-500';
      default: return 'bg-slate-800';
    }
  };

  const StatCard = ({ icon: Icon, label, value, unit, colorClass, trend }: any) => (
    <div className={`p-6 rounded-[2rem] border transition-all duration-500 hover:translate-y-[-4px] ${
      isDark ? 'bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'
    }`}>
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 rounded-2xl ${colorClass}`}>
          <Icon className="text-white w-6 h-6" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-black ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
          <span className={`text-sm font-bold ${isDark ? 'text-zinc-500' : 'text-slate-300'}`}>{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className={`text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block ${
            isDark ? 'bg-white/10 text-white' : 'bg-emerald-100 text-emerald-700'
          }`}>Intelligence Hub</span>
          <h2 className={`text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Farm Overview</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 border font-bold text-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-100 text-slate-700 shadow-sm'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse`} style={{backgroundColor: themeColors[theme]}} />
            Live Sync: Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Droplets} 
          label="Soil Moisture" 
          value={currentData.moisture} 
          unit="%" 
          colorClass={getAccentBg(theme)} 
          trend={2.5}
        />
        <StatCard 
          icon={Thermometer} 
          label="Temperature" 
          value={currentData.temperature} 
          unit="°C" 
          colorClass="bg-orange-500" 
          trend={-1.2}
        />
        <StatCard 
          icon={Wind} 
          label="Air Humidity" 
          value={currentData.humidity} 
          unit="%" 
          colorClass="bg-indigo-500" 
          trend={0.8}
        />
        <StatCard 
          icon={CloudRain} 
          label="Water Tank" 
          value={currentData.waterLevel} 
          unit="%" 
          colorClass="bg-cyan-500" 
          trend={-5.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border transition-all duration-500 ${
          isDark ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl'
        }`}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className={`font-black text-xl mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Hydration Patterns</h4>
              <p className={`text-sm font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Last 7 days of sensor readings</p>
            </div>
            <div className="hidden sm:flex gap-4">
              <span className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: themeColors[theme]}} /> Soil
              </span>
              <span className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                <div className="w-3 h-3 rounded-full bg-indigo-400" /> Air
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors[theme]} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={themeColors[theme]} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272a" : "#f1f5f9"} />
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: isDark ? '#52525b' : '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: isDark ? '#52525b' : '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000',
                    fontWeight: 700
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="moisture" 
                  stroke={themeColors[theme]} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#mainGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#818cf8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={`p-8 rounded-[2.5rem] border flex-1 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <h4 className={`font-black text-xl mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Action List</h4>
            <div className="space-y-4">
              <div className={`flex gap-4 p-5 rounded-3xl border ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`p-2.5 rounded-xl h-fit ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-200 text-amber-700'}`}>
                  <AlertCircle size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className={`font-black text-sm ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>Tank Level Low</p>
                  <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-amber-500/70' : 'text-amber-700'}`}>Critical threshold reached. Auto-refill cycle requested.</p>
                </div>
              </div>
              <div className={`flex gap-4 p-5 rounded-3xl border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                <div className={`p-2.5 rounded-xl h-fit ${isDark ? 'bg-indigo-500/20 text-indigo-500' : 'bg-indigo-200 text-indigo-700'}`}>
                  <Droplets size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className={`font-black text-sm ${isDark ? 'text-indigo-400' : 'text-indigo-900'}`}>Section B-12 Clear</p>
                  <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-indigo-500/70' : 'text-indigo-700'}`}>Manual override complete. Optimal saturation achieved.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onViewReports}
              className={`mt-8 w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group ${
                isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm'
              }`}
            >
              View Full History
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
            </button>
          </div>
          
          <div className={`p-6 rounded-[2.5rem] flex items-center gap-6 overflow-hidden relative group transition-all duration-500 hover:scale-[1.02] cursor-pointer ${getAccentBg(theme)}`}>
            <div className="bg-white/20 p-4 rounded-3xl text-white">
              <TrendingUp size={32} strokeWidth={3} />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-1">Efficiency</p>
              <h5 className="text-white text-xl font-black">+14% Improvement</h5>
            </div>
            <div className="absolute top-[-20px] right-[-20px] opacity-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
              <TrendingUp size={140} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
