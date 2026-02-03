import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Diagnosis from './components/Diagnosis';
import IrrigationHub from './components/IrrigationHub';
import Settings from './components/Settings';
import ChatSupport from './components/ChatSupport';
import { SensorData, IrrigationState, ThemeType, DiseaseAnalysis, DiagnosisHistoryItem } from './types';
import { Loader2, Calendar, Activity, ChevronRight, Search, ShieldCheck, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [themePreference, setThemePreference] = useState<ThemeType>('auto');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [irrigation, setIrrigation] = useState<IrrigationState>({
    isAutoMode: true,
    isPumpOn: false,
    threshold: 45
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureAudioEnabled = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playAlertSound = useCallback((type: 'warning' | 'alert' | 'success') => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      ensureAudioEnabled();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'warning') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
      } else if (type === 'alert') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1200, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context Error", e);
    }
  }, [soundEnabled, ensureAudioEnabled]);

  const currentResolvedTheme = useMemo((): ThemeType => {
    if (themePreference !== 'auto') return themePreference;
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'mint';
    if (hour >= 12 && hour < 17) return 'matcha';
    if (hour >= 17 && hour < 20) return 'autumn';
    return 'midnight';
  }, [themePreference]);

  useEffect(() => {
    const darkThemes: ThemeType[] = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'];
    if (darkThemes.includes(currentResolvedTheme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentResolvedTheme]);

  useEffect(() => {
    const saved = localStorage.getItem('agriguard_diagnosis_history');
    if (saved) {
      try {
        const parsed: DiagnosisHistoryItem[] = JSON.parse(saved);
        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        const validItems = parsed.filter(item => (now - item.timestamp) < TWENTY_FOUR_HOURS);
        setDiagnosisHistory(validItems);
        if (validItems.length !== parsed.length) {
          localStorage.setItem('agriguard_diagnosis_history', JSON.stringify(validItems));
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    const generateHistory = () => {
      const data: SensorData[] = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          timestamp: date.toLocaleDateString('en-US', { weekday: 'short' }),
          moisture: 35 + Math.floor(Math.random() * 30),
          humidity: 50 + Math.floor(Math.random() * 20),
          temperature: 24 + Math.floor(Math.random() * 10),
          waterLevel: 60 + Math.floor(Math.random() * 30),
        });
      }
      setHistoricalData(data);
    };
    generateHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const newData = [...prev.slice(0, -1)];
        let newMoisture = last.moisture;
        let newWaterLevel = last.waterLevel;

        if (irrigation.isPumpOn) {
          newMoisture = Math.min(100, last.moisture + 0.8);
          newWaterLevel = Math.max(0, last.waterLevel - 0.3);
        } else {
          newMoisture = Math.max(0, last.moisture - 0.08);
          newWaterLevel = Math.min(100, last.waterLevel + 0.02);
        }

        if (irrigation.isAutoMode) {
          if (newMoisture < irrigation.threshold && !irrigation.isPumpOn && newWaterLevel > 5) {
            setIrrigation(curr => ({ ...curr, isPumpOn: true }));
            playAlertSound('success');
          } else if ((newMoisture > irrigation.threshold + 10 || newWaterLevel <= 2) && irrigation.isPumpOn) {
            setIrrigation(curr => ({ ...curr, isPumpOn: false }));
          }
        }

        newData.push({
          ...last,
          moisture: Number(newMoisture.toFixed(1)),
          waterLevel: Number(newWaterLevel.toFixed(1))
        });
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [irrigation, playAlertSound]);

  const handleTabSwitch = (tab: string) => {
    if (tab === activeTab) return;
    ensureAudioEnabled();
    setIsGlobalLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsGlobalLoading(false);
    }, 350);
  };

  const handleAnalysisComplete = (analysis: DiseaseAnalysis) => {
    const newHistoryItem: DiagnosisHistoryItem = {
      ...analysis,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setDiagnosisHistory(prev => {
      const updated = [newHistoryItem, ...prev];
      localStorage.setItem('agriguard_diagnosis_history', JSON.stringify(updated));
      return updated;
    });
    if (analysis.status === 'Infected') {
      playAlertSound('alert');
    } else {
      playAlertSound('success');
    }
  };

  const handleDownloadReport = useCallback(() => {
    if (historicalData.length === 0) return;
    const headers = ["Day", "Soil Moisture (%)", "Air Humidity (%)", "Temperature (°C)", "Water Level (%)"];
    const rows = historicalData.map(d => [d.timestamp, d.moisture, d.humidity, d.temperature, d.waterLevel]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriGuard_Weekly_Farm_Report_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playAlertSound('success');
  }, [historicalData, playAlertSound]);

  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(currentResolvedTheme);

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabSwitch} theme={currentResolvedTheme}>
      <div className="max-w-7xl mx-auto w-full" onClick={ensureAudioEnabled}>
        {isGlobalLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in">
            <Loader2 className={`w-12 h-12 animate-spin text-emerald-500`} />
            <p className="font-black uppercase tracking-widest text-xs opacity-50">Syncing Intelligence...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && historicalData.length > 0 && (
              <Dashboard 
                historicalData={historicalData} 
                onViewReports={() => handleTabSwitch('history')} 
                onDownloadReport={handleDownloadReport}
                theme={currentResolvedTheme} 
              />
            )}
            {activeTab === 'diagnosis' && <Diagnosis theme={currentResolvedTheme} onAnalysisComplete={handleAnalysisComplete} />}
            {activeTab === 'irrigation' && historicalData.length > 0 && <IrrigationHub irrigation={irrigation} setIrrigation={setIrrigation} data={historicalData[historicalData.length - 1]} theme={currentResolvedTheme} />}
            {activeTab === 'settings' && <Settings theme={themePreference} setTheme={setThemePreference} resolvedTheme={currentResolvedTheme} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />}
            {activeTab === 'history' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className={`text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block ${
                      isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>Archive Hub</span>
                    <h2 className={`text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Historical Logs</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
                        <Search size={24} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Diagnosis Archive</h3>
                    </div>
                    {diagnosisHistory.length === 0 ? (
                      <div className={`py-12 text-center rounded-3xl border-2 border-dashed ${isDark ? 'border-zinc-800' : 'border-slate-50'}`}>
                        <AlertCircle className={`mx-auto mb-4 ${isDark ? 'text-zinc-700' : 'text-slate-200'}`} size={48} />
                        <p className={`font-bold ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>No recent scans found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {diagnosisHistory.map((item) => (
                          <div key={item.id} className={`p-6 rounded-3xl border transition-all hover:translate-x-1 ${
                            isDark ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' : 'bg-slate-50 border-slate-100 hover:border-slate-300 shadow-sm'
                          }`}>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.cropName}</h4>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                                  {new Date(item.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' : 
                                item.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className={`text-sm font-medium line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                              {item.description}
                            </p>
                            {item.diseaseName && (
                              <div className="mt-3 inline-block px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[10px] font-bold text-rose-500">
                                Pathogen: {item.diseaseName}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <Activity size={24} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Daily Telemetry</h3>
                    </div>
                    <div className="space-y-4">
                      {historicalData.map((d, i) => (
                        <div key={i} className={`group flex items-center justify-between p-6 rounded-3xl border transition-all ${
                          isDark ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800' : 'bg-slate-50 border-slate-100 hover:bg-white shadow-sm'
                        }`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                              isDark ? 'bg-zinc-900 text-zinc-500' : 'bg-white text-slate-400 shadow-sm'
                            }`}>
                              {d.timestamp}
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Moisture</span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.moisture}%</span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Temp</span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.temperature}°C</span>
                              </div>
                            </div>
                          </div>
                          <ShieldCheck size={20} className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ChatSupport theme={currentResolvedTheme} />
    </Layout>
  );
};

export default App;