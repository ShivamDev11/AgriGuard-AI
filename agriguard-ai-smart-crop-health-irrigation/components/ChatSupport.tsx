import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf, Loader2, Sparkles, User } from 'lucide-react';
import { createAgriChat } from '../geminiService';
import { ThemeType } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatSupportProps {
  theme: ThemeType;
}

const ChatSupport: React.FC<ChatSupportProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to your farm hub. I am Farmy, your AI assistant. How can I assist your farm today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession] = useState(() => createAgriChat());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(theme);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const botText = result.text || "I apologize, I encountered a transmission error. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to Farmy's brain. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const themeColors = {
    'bio-synth': 'bg-emerald-500',
    'midnight': 'bg-blue-600',
    'autumn': 'bg-orange-600',
    'nordic': 'bg-slate-800',
    'obsidian': 'bg-violet-600',
    'cyberpunk': 'bg-fuchsia-600',
    'forest': 'bg-emerald-800',
    'ocean': 'bg-cyan-600',
    'sakura': 'bg-pink-400',
    'volcanic': 'bg-red-600',
    'electric': 'bg-indigo-600',
    'matcha': 'bg-[#606c38]',
    'solar': 'bg-yellow-500',
    'mint': 'bg-teal-500',
    'auto': 'bg-emerald-500',
    'desert': 'bg-orange-700'
  };

  const accentColor = themeColors[theme] || 'bg-emerald-500';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className={`mb-4 w-[90vw] sm:w-[400px] h-[500px] rounded-[2.5rem] flex flex-col overflow-hidden border shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          {/* Header */}
          <div className={`p-6 flex items-center justify-between text-white ${accentColor}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Leaf size={20} strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight">Farmy Expert</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Farmy Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                    ? (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-400') 
                    : `${accentColor} text-white`
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={14} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user'
                    ? (isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-800')
                    : (isDark ? 'bg-zinc-800/50 border border-zinc-800 text-zinc-200' : 'bg-slate-50 border border-slate-100 text-slate-700')
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`flex gap-3 items-center p-4 rounded-2xl ${isDark ? 'bg-zinc-800/30' : 'bg-slate-50'}`}>
                  <Loader2 size={16} className="animate-spin opacity-50" />
                  <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Farmy is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
              isDark ? 'bg-zinc-800 border-zinc-700 focus-within:border-zinc-500' : 'bg-white border-slate-100 focus-within:border-slate-300 shadow-inner'
            }`}>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Farmy anything..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-1 text-sm font-bold"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-30 ${accentColor} text-white`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all transform hover:scale-110 active:scale-90 relative group ${accentColor}`}
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
        {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={28} strokeWidth={2.5} />}
      </button>
    </div>
  );
};

export default ChatSupport;