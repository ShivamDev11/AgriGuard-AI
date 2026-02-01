
import React, { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Droplets, 
  History, 
  Leaf, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { ThemeType } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: ThemeType;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'diagnosis', label: 'AI Diagnosis', icon: Camera },
    { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets },
    { id: 'history', label: 'History', icon: History },
  ];

  const isThemeDark = (t: ThemeType) => 
    ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(t);

  // Added 'auto' key to themeClasses to fix missing property error for Record<ThemeType, any>
  const themeClasses: Record<ThemeType, any> = {
    'auto': { sidebar: 'bg-white', active: 'bg-emerald-500 text-white shadow-emerald-200', text: 'text-slate-600', logo: 'text-emerald-500' },
    'bio-synth': { sidebar: 'bg-white', active: 'bg-emerald-500 text-white shadow-emerald-200', text: 'text-slate-600', logo: 'text-emerald-500' },
    'midnight': { sidebar: 'bg-slate-900 border-slate-800', active: 'bg-blue-600 text-white shadow-blue-900/40', text: 'text-slate-400', logo: 'text-blue-400' },
    'autumn': { sidebar: 'bg-stone-50', active: 'bg-orange-600 text-white shadow-orange-200', text: 'text-stone-600', logo: 'text-orange-600' },
    'nordic': { sidebar: 'bg-slate-50 border-slate-200', active: 'bg-slate-800 text-white shadow-slate-300', text: 'text-slate-500', logo: 'text-slate-800' },
    'obsidian': { sidebar: 'bg-black border-zinc-800', active: 'bg-violet-600 text-white shadow-violet-900/40', text: 'text-zinc-500', logo: 'text-violet-500' },
    'cyberpunk': { sidebar: 'bg-[#0f0524] border-fuchsia-900/30', active: 'bg-fuchsia-600 text-white shadow-fuchsia-900/50', text: 'text-fuchsia-300/50', logo: 'text-fuchsia-500' },
    'desert': { sidebar: 'bg-[#fff9f0] border-orange-200', active: 'bg-[#d97706] text-white shadow-orange-200', text: 'text-orange-900/60', logo: 'text-orange-700' },
    'forest': { sidebar: 'bg-[#0a1a0a] border-emerald-900/20', active: 'bg-emerald-800 text-emerald-50 shadow-emerald-950', text: 'text-emerald-700', logo: 'text-emerald-600' },
    'ocean': { sidebar: 'bg-[#020c1b] border-cyan-900/30', active: 'bg-cyan-600 text-white shadow-cyan-900', text: 'text-cyan-800', logo: 'text-cyan-500' },
    'sakura': { sidebar: 'bg-[#fff5f7] border-pink-100', active: 'bg-pink-400 text-white shadow-pink-100', text: 'text-pink-600/60', logo: 'text-pink-500' },
    'volcanic': { sidebar: 'bg-[#1a1311] border-red-900/20', active: 'bg-red-600 text-white shadow-red-900/40', text: 'text-red-900/40', logo: 'text-red-500' },
    'electric': { sidebar: 'bg-[#12002e] border-indigo-900/30', active: 'bg-indigo-600 text-white shadow-indigo-900/40', text: 'text-indigo-400/50', logo: 'text-indigo-500' },
    'matcha': { sidebar: 'bg-[#fcfdf2] border-lime-200', active: 'bg-[#606c38] text-white shadow-lime-100', text: 'text-[#283618]/60', logo: 'text-[#606c38]' },
    'solar': { sidebar: 'bg-[#1a1200] border-yellow-900/20', active: 'bg-yellow-500 text-black shadow-yellow-900/40', text: 'text-yellow-700', logo: 'text-yellow-500' },
    'mint': { sidebar: 'bg-[#f0fffb] border-teal-100', active: 'bg-teal-500 text-white shadow-teal-100', text: 'text-teal-700/60', logo: 'text-teal-500' }
  };

  const currentTheme = themeClasses[theme];
  const isDark = isThemeDark(theme);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-72 border-r p-6 sticky top-0 h-screen transition-all duration-500 ${currentTheme.sidebar}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className={`p-2.5 rounded-2xl ${theme === 'bio-synth' ? 'bg-emerald-500' : 'bg-current opacity-20'}`}>
            <Leaf className={`${theme === 'bio-synth' ? 'text-white' : currentTheme.logo} w-6 h-6`} />
          </div>
          <h1 className={`font-black text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>AgriGuard AI</h1>
        </div>
        
        <nav className="flex-1 space-y-2.5 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-semibold ${
                activeTab === item.id 
                ? currentTheme.active 
                : `${currentTheme.text} hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <item.icon size={22} strokeWidth={2.5} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-zinc-800">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl transition-all duration-300 font-semibold ${
              activeTab === 'settings' 
              ? currentTheme.active 
              : `${currentTheme.text} hover:bg-black/5 dark:hover:bg-white/5`
            }`}
          >
            <Settings size={22} strokeWidth={2.5} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        <header className="md:hidden glass-effect sticky top-0 z-30 flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Leaf className={currentTheme.logo} size={24} />
            <h1 className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>AgriGuard</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className={`md:hidden fixed inset-0 z-20 pt-20 px-6 space-y-3 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl overflow-y-auto`}>
            {[...navItems, { id: 'settings', label: 'Settings', icon: Settings }].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${
                  activeTab === item.id 
                  ? currentTheme.active 
                  : `${currentTheme.text}`
                }`}
              >
                <item.icon size={24} />
                <span className="text-lg">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="p-6 md:p-10 pb-28 md:pb-10 flex-1 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
