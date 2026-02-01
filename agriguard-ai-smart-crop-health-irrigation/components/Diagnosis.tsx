
import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCcw, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Loader2, Droplets, Leaf } from 'lucide-react';
import { analyzeCropHealth } from '../geminiService';
import { DiseaseAnalysis, ThemeType } from '../types';

interface DiagnosisProps {
  theme: ThemeType;
  onAnalysisComplete?: (result: DiseaseAnalysis) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ theme, onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = ['midnight', 'obsidian', 'cyberpunk', 'forest', 'ocean', 'volcanic', 'electric', 'solar'].includes(theme);

  const startCamera = async () => {
    setIsCapturing(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeCropHealth(image);
      setResult(analysis);
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setIsCapturing(false);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Healthy': return <CheckCircle2 className="text-emerald-500 w-8 h-8" />;
      case 'Warning': return <AlertTriangle className="text-amber-500 w-8 h-8" />;
      default: return <XCircle className="text-rose-500 w-8 h-8" />;
    }
  };

  const themeAccentClass = 
    theme === 'bio-synth' ? 'bg-emerald-500' : 
    theme === 'midnight' ? 'bg-blue-600' : 
    theme === 'autumn' ? 'bg-orange-600' : 
    theme === 'nordic' ? 'bg-slate-800' : 'bg-violet-600';

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h2 className={`text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Crop Health Diagnosis</h2>
        <p className={`font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Instant pathogen detection for 120+ crop varieties.</p>
      </div>

      <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
        isDark ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'
      }`}>
        {!image && !isCapturing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
            <button 
              onClick={startCamera}
              className={`flex flex-col items-center justify-center gap-6 rounded-[2rem] border-4 border-dashed transition-all group ${
                isDark ? 'border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500/50' : 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              <div className={`p-6 rounded-3xl transition-transform group-hover:scale-110 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-100 text-emerald-600'}`}>
                <Camera size={48} strokeWidth={2} />
              </div>
              <div className="text-center">
                <span className={`block font-black text-xl ${isDark ? 'text-white' : 'text-emerald-900'}`}>Live Scanner</span>
                <span className={`text-sm font-bold opacity-60`}>Use device camera</span>
              </div>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-6 rounded-[2rem] border-4 border-dashed transition-all group ${
                isDark ? 'border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-violet-500/50' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`p-6 rounded-3xl transition-transform group-hover:scale-110 ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-200 text-slate-600'}`}>
                <Upload size={48} strokeWidth={2} />
              </div>
              <div className="text-center">
                <span className={`block font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Upload Asset</span>
                <span className={`text-sm font-bold opacity-60`}>Select from gallery</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </button>
          </div>
        )}

        {isCapturing && (
          <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6">
              <button 
                onClick={captureImage}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
              >
                <div className="w-16 h-16 border-4 border-slate-900 rounded-full" />
              </button>
              <button 
                onClick={stopCamera}
                className="bg-rose-500 text-white p-6 rounded-full shadow-2xl hover:bg-rose-600 transition-colors"
              >
                <XCircle size={32} />
              </button>
            </div>
          </div>
        )}

        {image && !result && !loading && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900/5 border-2 border-slate-100 dark:border-zinc-800">
              <img src={image} className="w-full h-full object-contain" alt="Selected crop" />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={runAnalysis}
                className={`flex-1 ${themeAccentClass} text-white font-black py-5 rounded-2xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg`}
              >
                Begin Deep Scan
                <ChevronRight size={24} strokeWidth={3} />
              </button>
              <button 
                onClick={reset}
                className={`px-8 py-5 font-black rounded-2xl transition-all ${isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <Loader2 className={`w-16 h-16 ${isDark ? 'text-blue-500' : 'text-emerald-500'} animate-spin`} strokeWidth={3} />
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <Leaf className={`${isDark ? 'text-blue-500/50' : 'text-emerald-500/50'} w-6 h-6`} />
              </div>
            </div>
            <div className="text-center">
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Identifying Sample...</p>
              <p className={`font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Comparing tissues against global pathogen database</p>
            </div>
          </div>
        )}

        {result && (
          <div className="animate-in zoom-in-95 duration-700 space-y-10">
            <div className={`flex flex-col md:flex-row gap-8 p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
              <div className="w-full md:w-64 h-64 shrink-0 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800">
                <img src={image!} className="w-full h-full object-cover" alt="Result" />
              </div>
              <div className="flex-1 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <StatusIcon status={result.status} />
                    <div>
                      <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.cropName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          result.status === 'Healthy' ? 'bg-emerald-500 text-white' : 
                          result.status === 'Warning' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {result.status}
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          Analysis Confidence: {result.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed font-medium ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  {result.description}
                </p>
                {result.diseaseName && (
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider ${isDark ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-rose-50 border border-rose-100 text-rose-700'}`}>
                    <AlertTriangle size={20} />
                    Pathogen: {result.diseaseName}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className={`font-black text-xl flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Droplets size={24} strokeWidth={2.5} />
                  </div>
                  Immediate Action
                </h4>
                <div className="space-y-3">
                  {result.treatment.map((step, i) => (
                    <div key={i} className={`flex gap-4 p-5 rounded-2xl border transition-all hover:translate-x-1 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                      <span className={`font-black text-xl ${isDark ? 'text-blue-500' : 'text-emerald-500'}`}>{i + 1}.</span>
                      <p className="font-bold">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className={`font-black text-xl flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Leaf size={24} strokeWidth={2.5} />
                  </div>
                  Preventative Care
                </h4>
                <div className="space-y-3">
                  {result.preventativeMeasures.map((measure, i) => (
                    <div key={i} className={`flex gap-4 p-5 rounded-2xl border transition-all hover:translate-x-1 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} strokeWidth={3} />
                      <p className="font-bold">{measure}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={reset}
              className={`w-full py-5 font-black text-lg rounded-[2rem] transition-all ${
                isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Analyze New Sample
            </button>
          </div>
        )}

        {error && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl flex items-center gap-4">
            <XCircle size={28} strokeWidth={2.5} />
            <div className="flex-1">
              <p className="font-black">Error Occurred</p>
              <p className="font-bold text-sm opacity-80">{error}</p>
            </div>
            <button onClick={reset} className="px-5 py-2 bg-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-widest">Retry</button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Diagnosis;
