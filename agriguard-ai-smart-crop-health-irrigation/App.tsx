
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Diagnosis from './components/Diagnosis';
import IrrigationHub from './components/IrrigationHub';
import Settings from './components/Settings';
import { SensorData, IrrigationState, ThemeType, DiseaseAnalysis } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [themePreference, setThemePreference] = useState<ThemeType>('auto');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [irrigation, setIrrigation] = useState<IrrigationState>({
    isAutoMode: true,
    isPumpOn: false,
    threshold: 45
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  // Resume audio context on any user interaction to bypass browser restrictions
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

  // Main system simulation loop
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

        // Handle auto irrigation logic
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
            {activeTab === 'dashboard' && historicalData.length > 0 && <Dashboard historicalData={historicalData} onViewReports={() => handleTabSwitch('history')} theme={currentResolvedTheme} />}
            {activeTab === 'diagnosis' && <Diagnosis theme={currentResolvedTheme} onAnalysisComplete={(res) => res.status === 'Infected' ? playAlertSound('alert') : playAlertSound('success')} />}
            {activeTab === 'irrigation' && historicalData.length > 0 && <IrrigationHub irrigation={irrigation} setIrrigation={setIrrigation} data={historicalData[historicalData.length - 1]} theme={currentResolvedTheme} />}
            {activeTab === 'settings' && <Settings theme={themePreference} setTheme={setThemePreference} resolvedTheme={currentResolvedTheme} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />}
            {activeTab === 'history' && (
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border dark:border-zinc-800 animate-in slide-in-from-bottom-6">
                <h2 className="text-3xl font-black mb-8 dark:text-white">Historical Logs</h2>
                <div className="space-y-4">
                  {historicalData.map((d, i) => (
                    <div key={i} className="flex justify-between p-4 border-b dark:border-zinc-800 dark:text-zinc-400">
                      <span className="font-bold">{d.timestamp}</span>
                      <span>{d.moisture}% Moisture</span>
                      <span>{d.temperature}°C</span>
                      <span className="text-emerald-500 font-bold uppercase text-xs">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default App;
